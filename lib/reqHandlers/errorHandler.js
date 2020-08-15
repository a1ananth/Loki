import Logger from '../../logger';

const ErrorHandler = (err, req, res, next) => {
  const defaultMsgs = {
    400: 'Bad data',
    401: 'Need authentication',
    403: 'Forbidden',
  };

  if (!err) {
    next();
  }

  const status = err.status || 500;

  if (status === 500) {
    if (err.debugData) {
      Logger.error(err);
      Logger.error(err.debugData);
    } else {
      Logger.error(err);
    }
  }

  res.status(status);
  res.jsonp({
    success: false,
    error: err.customMsg || defaultMsgs[status] || err.message,
  });
};

export default ErrorHandler;
