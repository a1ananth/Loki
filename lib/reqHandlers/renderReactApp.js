import fs from 'fs';
import path from 'path';
import request from 'request';
import cfg from '../../cfg';

export function renderReactApp(req, res) {
  if (cfg.env === 'development') {
    let proxyUrl;
    if (req.path.indexOf('.') !== -1 || req.path.indexOf('__webpack_hmr') !== -1) {
      proxyUrl = `http://localhost:3000${req.path}`;
    } else {
      proxyUrl = `http://localhost:3000`;
    }

    try {
      request(proxyUrl).pipe(res);
    } catch (err) {
      res.send('Failed to render react app in dev environment. Are you sure the react app is running?')
    }

    return;
  }

  let filePath;

  if (!req.path || req.path.indexOf('.') === -1) {
    filePath = path.join(__dirname, '../', '../', 'app', 'dist', 'index.html');

  } else {
    filePath = path.join(__dirname, '../', '../', 'app', 'dist', req.path);
  }

  fs.stat(filePath, (err) => {
    if (err) {
      res.status(404);
      return res.send('App not found. Please make sure your installation is right.');
    }

    res.sendFile(filePath);
  });
}
