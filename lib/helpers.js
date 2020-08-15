import crypto from 'crypto';
import fs from 'fs';
import cfg from '../cfg';
import Logger from '../logger';

const sharp = require('sharp');

export function sha1File(path) {
  return new Promise((resolve, reject) => {
    let hash = crypto.createHash('sha1');
    let stream = fs.createReadStream(path);
    stream.on('error', err => reject(err));
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

export function sha256(value, secretKey) {
  const hmac = crypto.createHmac('sha256', secretKey);
  const data = hmac.update(value);
  return data.digest('hex');
}

export function randint(start, end) {
  const diff = end - start;
  return Math.floor((Math.random() * diff) + start);
}

export async function createLogoImages(fileObject) {
  const originalFilePath = fileObject.storageDetails.localFilePath;

  const staticLogoFilePath = `${cfg.paths.static}/logo.png`;

  await sharp(originalFilePath)
  .resize(1024, 1024)
  .toFile(staticLogoFilePath);

  Logger.debug(`Created logo file at ${staticLogoFilePath}`);

  const faviconPath = `${cfg.paths.static}/favicon.png`;

  await sharp(originalFilePath)
  .resize(32, 32)
  .toFile(faviconPath);

  Logger.debug(`Created favicon file at ${faviconPath}`);

  const favicon2Path = `${cfg.paths.static}/favicon-16.png`;

  await sharp(originalFilePath)
  .resize(16, 16)
  .toFile(favicon2Path);

  Logger.debug(`Created favicon file at ${favicon2Path}`);

  // Create icons for browser extension
  const sizes = [16, 32, 48, 128, 256];
  for (const size of sizes) {
    const iconPath = `${cfg.paths.extension}/icons/icon${size}.png`;

    await sharp(originalFilePath)
    .resize(size, size)
    .toFile(iconPath);

    Logger.debug(`Created extension icon file at ${iconPath}`);
  }
}

export async function updateBaseUrlInExtension(baseUrl) {
  return new Promise((resolve, reject) => {
    const jsFilePath = `${cfg.paths.extension}/libraries/apiBaseUrl.js`;
    const strToWrite = `const API_BASE = '${baseUrl}';\n`;

    fs.writeFile(jsFilePath, strToWrite, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
}

export async function rewriteOpenSearchXML(appConfig) {
  if (!appConfig.appearance) {
    throw new Error('Appearance field is missing');
  }

  if (!appConfig.search) {
    throw new Error('System config field (search) is missing');
  }

  let siteName;
  if (appConfig.appearance.siteName) {
    siteName = appConfig.appearance.siteName;
  } else {
    siteName = cfg.app_title;
  }

  let desc;
  if (appConfig.appearance.tagline) {
    desc = appConfig.appearance.tagline;
  } else {
    desc = 'You may not be able to remember all the important information you read on the web. Loki does it for you..';
  }

  const imgPath = `${appConfig.search.baseUrl}/static/favicon-16.png`;
  const searchUrl = `${appConfig.search.baseUrl}/search?q={searchTerms}`;
  const suggestionsUrl = `${appConfig.search.baseUrl}/suggest?q={searchTerms}`;

  const xmlStr = `<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/" xmlns:moz="http://www.mozilla.org/2006/browser/search/">
    <ShortName>${siteName}</ShortName>
    <Description>
      ${desc}
    </Description>
    <InputEncoding>UTF-8</InputEncoding>
    <Image width="16" height="16" type="image/png">${imgPath}</Image>
    <Url type="text/html" method="get" template="${searchUrl}"/>
    <Url type="application/x-suggestions+json" method="GET" template="${suggestionsUrl}" />
  </OpenSearchDescription>
`;

  return new Promise((resolve, reject) => {
    const xmlFilePath = `${cfg.paths.static}/opensearch.xml`;

    fs.writeFile(xmlFilePath, xmlStr, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
}