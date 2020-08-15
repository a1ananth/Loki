import co from 'co';
import AuthTokensLib from '../authTokens';
import Logger from '../../logger';

const EditAccessCheck = (req, res, next) => {
  co(function*() {
    const { isPubliclyEditable } = yield AuthTokensLib.isPubliclyEditable();
    if (isPubliclyEditable) {
      return next();
    }

    const { tokenObj } = req;

    if (!tokenObj) {
      res.status(401);
      return res.jsonp({
        success: false,
        error: 'Authentication is required to access this instance.',
        unauthorised: true,
      });
    }

    if (!tokenObj.canEdit) {
      res.status(401);
      return res.jsonp({
        success: false,
        error: 'You are not allowed to access this resource.',
        unauthorised: true,
      });
    }

    return next();
  }).catch((err) => {
    err.status = 500;
    err.customMsg = 'Failed to verify administrator';
    Logger.error(err.customMsg, err);
    return next(err);
  });
};

export default EditAccessCheck;
