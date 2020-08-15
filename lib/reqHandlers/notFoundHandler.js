import { renderReactApp } from './renderReactApp';

const NotFoundHandler = (req, res) => {
  //const url = req.path;

  if (!req.xhr) {
    return renderReactApp(req, res);
  }

  res.status(404);
  return res.jsonp({
    error: res.msg404 || 'Resource not found',
  });
};

export default NotFoundHandler;
