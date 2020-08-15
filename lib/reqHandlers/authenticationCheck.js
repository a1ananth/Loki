import co from 'co';
import AppConfigLib from '../appConfig';
import AuthTokensLib from '../authTokens';
import Logger from '../../logger';

const AuthenticationCheck = (req, res, next) => {
  co(function*() {
    const { isPubliclyEditable } = yield AuthTokensLib.isPubliclyEditable();
    if (isPubliclyEditable) {
      return next();
    }

    let authRequired = false;

    const appConfig = yield AppConfigLib.getConfiguration();
    if (appConfig.authentication && appConfig.authentication.requireAuthentication) {
      authRequired = true;
    }

    // Authentication is required in the app
    const { authToken } = req.cookies;

    if (!authToken) {
      if (!authRequired) {
        return next();
      }

      res.status(401);
      return res.jsonp({
        success: false,
        error: 'Authentication is required to access this instance.',
        unauthorised: true,
      });
    }

    req.authToken = authToken;

    const tokenObj = yield AuthTokensLib.findByToken(authToken);
    if (!tokenObj) {
      if (!authRequired) {
        return next();
      }

      res.status(401);
      return res.jsonp({
        success: false,
        error: 'Authentication token is invalid.',
        unauthorised: true,
      });
    }

    req.tokenObj = tokenObj;

    return next();
  }).catch((err) => {
    err.status = 500;
    err.customMsg = 'Failed to verify authorization';
    Logger.error(err.customMsg, err);
    return next(err);
  });
};

export default AuthenticationCheck;
