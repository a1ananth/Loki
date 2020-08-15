require('@babel/register');

import http from 'http';
import app from './app';
import cfg from './cfg';
import Logger from './logger';
// import fetchWikiLinks from './crons/fetchWikiLinks';

// Start server
const server = http.createServer(app);
server.setTimeout(20 * 60 * 1000); // 20 minutes
server.listen(cfg.port, () => {
  Logger.info('Express server is up and running on port', cfg.port);
});

// fetchWikiLinks();

// Fetch uncrawled wikipedia links every 4 hours
// setInterval(fetchWikiLinks, 4 * 60 * 60 * 1000);
