import cors from 'cors';
import cfg from '../../cfg';

export default cors({
  allowedHeaders: [
    'origin', 'x-requested-with', 'content-type',
    'accept', 'x-xsrf-token',
  ],
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
  origin: (origin, callback) => {
    // allow all requests in dev environment
    if (cfg.env === 'development') {
      return callback(null, true);
    }

    //if (!origin) {
    //  return callback(null, true);
    //}

    if (cfg['cors.whitelist'].length === 0) {
      return callback(null, true);
    }

    if (cfg['cors.whitelist'].indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // allowing extensions
    if (origin.includes(`chrome-extension://`)) {
      return callback(null, true);
    }

    // TODO Find pattern for firefox

    return callback(new Error('Not allowed by CORS'));
  },
});
