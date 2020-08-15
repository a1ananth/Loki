import morgan from 'morgan';
import Logger from '../../logger';

const onResponse = require('on-response');

const OnResponseLogger = (req, res, next) => {
  onResponse(req, res, () => {
    // Default log level is 'debug'
    let level = 'debug';

    // If response status is 40X, log level becomes 'warn'
    if (res.statusCode >= 400 && res.statusCode < 500) {
      level = 'warn';
    }

    // If response status is 50X, log level becomes 'error'
    if (res.statusCode >= 500) {
      level = 'error';
    }

    Logger[level](
      '%s - %s [%s] "%s %s HTTP/%s" %s %s "%s" "%s"',
      morgan['remote-addr'](req, res),
      morgan['remote-user'](req, res),
      morgan.date(req, res, 'clf'),
      morgan.method(req, res),
      morgan.url(req, res),
      morgan['http-version'](req, res),
      morgan.status(req, res),
      morgan.res(req, res, 'content-length'),
      morgan.referrer(req, res),
      morgan['user-agent'](req, res),
    );
  });

  next();
};

export default OnResponseLogger;
