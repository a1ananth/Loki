import express from 'express';
import path from 'path';
import fs from 'fs';
import co from 'co';
import cfg from '../cfg';
import Logger from '../logger';
import archiver from 'archiver';

const router = express.Router();

const zipFileName = `loki-browser-extension-v${cfg.app_version}.zip`;

function createZipFile(extensionZipPath) {
  return new Promise((resolve, reject) => {
    Logger.debug('Creating ZIP file for extension');

    const exists = fs.existsSync(extensionZipPath);
    if (exists) {
      return reject(new Error('File already exists'));
    }

    const out = fs.createWriteStream(extensionZipPath);
    const archive = archiver('zip');

    out.on('close', () => {
      Logger.debug('Created ZIP file for extension successfully');
      resolve(true);
    });

    archive.on('error', (err) => {
      Logger.error('Error while creating ZIP file for extension', err);
      reject(err);
    });

    archive.on('warning', function (err) {
      Logger.warn('Warning while creating ZIP file for extension', err);
    });

    archive.pipe(out);
    archive.directory(cfg.paths.extension, false);
    archive.finalize();
  });
}

function fileExists(filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, function (err) {
      if (!err) {
        return resolve(true);
      }

      if (err.code === 'ENOENT') {
        return resolve(false);
      }

      return reject(err);
    });
  });
}

router.get('/download', (req, res) => {
  co(function*() {
    // TODO Ensure if Base URL is set in appConfig

    const extensionZipPath = path.join(__dirname, '/../static/', zipFileName);
    const exists = yield fileExists(extensionZipPath);

    if (exists) {
      return res.download(extensionZipPath);
    }

    const zipCreated = yield createZipFile(extensionZipPath);
    if (zipCreated) {
      return res.download(extensionZipPath);
    }

    res.status(500);
    res.send('Sorry, the extension ZIP file is unavailable at this moment. Please try later.');
  }).catch((err) => {
    Logger.error('Failed to get extension ZIP file', err);
    res.status(500);
    res.send('Sorry, the extension ZIP file is unavailable at this moment. Please try later.');
  });
});

export default router;
