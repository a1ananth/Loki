import express from 'express';
import co from 'co';
import multer from 'multer';
import cfg from '../cfg';
import Logger from '../logger';
import FilesLib from '../lib/files';
import AuthenticationCheck from '../lib/reqHandlers/authenticationCheck';

const router = express.Router();

const upload = multer({
  dest: cfg.uploads.tmp_path,
  limits: {
    files: 1,
    fileSize: cfg.uploads.max_size,
  },
});

router.use(AuthenticationCheck);

router.post('/', upload.single('file'), (req, res, next) => {
  const { file } = req;

  co(function*() {
    let fileObject = null;

    if (file && file.path) {
      try {
        fileObject = yield FilesLib.createFromFile(file);
      } catch (err) {
        res.status(400);
        return res.jsonp({
          success: false,
          error: err.message,
        });
      }
    } else {
      res.status(400);
      return res.jsonp({
        success: false,
        error: 'No media uploaded',
      });
    }

    res.jsonp({
      success: true,
      file: fileObject,
    });
  }).catch((err) => {
    err.status = 500;
    Logger.error('Failed to save file', err);
    err.customMsg = 'Failed to save file';
    return next(err);
  });
});

router.get('/f/:fileId', (req, res, next) => {
  let { fileId } = req.params;

  co(function*() {
    // TODO Get from redis
    const file = yield FilesLib.findById(fileId);
    if (!file) {
      return res.jsonp({
        success: false,
        error: 'Invalid File ID',
      });
    }

    if (!file.storageDetails) {
      return res.jsonp({
        success: false,
        error: 'This file is not available currently',
      });
    }

    const filePath = file.storageDetails.localFilePath;
    res.sendFile(filePath);
  }).catch((err) => {
    err.status = 500;
    Logger.error('Failed to send file', err);
    err.customMsg = 'Failed to send file';
    return next(err);
  });
});

export default router;
