import co from 'co';
import express from 'express';
import fs from 'fs';
import path from 'path';
import './mongo';
import cfg from './cfg';
import ErrorHandler from './lib/reqHandlers/errorHandler';
import NotFoundHandler from './lib/reqHandlers/notFoundHandler';
import OnResponseLogger from './lib/reqHandlers/onResponseLogger';
import cors from './lib/reqHandlers/enableCors';
import p3p from './lib/reqHandlers/enableP3P';
import DataRoutes from './routes/data';
import AppConfigRoutes from './routes/appConfig';
import AuthTokensRoutes from './routes/authTokens';
import ExtensionRoutes from './routes/extension';
import FilesRoutes from './routes/files';
import SearchRoutes from './routes/search';
import SuggestRoutes from './routes/suggest';
import Logger from './logger';

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
app.set('trust proxy', 1);

app.use(OnResponseLogger);
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(cors);
app.use(p3p);

// Status check
app.use('/status', (req, res) => {
  res.jsonp({
    success: true,
    status: 'Running',
  });
});

// Setting up routes
app.use('/app_config', AppConfigRoutes);
app.use('/auth_tokens', AuthTokensRoutes);
app.use('/data', DataRoutes);
app.use('/extension', ExtensionRoutes);
app.use('/files', FilesRoutes);
app.use('/search', SearchRoutes);
app.use('/suggest', SuggestRoutes);

app.get('/robots.txt', (req, res) => {
  res.status(200);
  res.set({
    'content-type': 'text/plain; charset=utf-8',
  });
  return res.send('User-agent: *\r\nDisallow: /');
});

app.use('/static', express.static(path.join(__dirname, 'static')));

app.use(ErrorHandler);
app.use(NotFoundHandler);

Logger.info('Initialized ExpressJS application');
export default app;
