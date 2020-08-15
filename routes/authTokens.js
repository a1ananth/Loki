import express from 'express';
import co from 'co';
import uuid from 'uuid';
import AuthTokensLib from '../lib/authTokens';
import Logger from '../logger';
import AuthenticationCheck from '../lib/reqHandlers/authenticationCheck';
import EditAccessCheck from '../lib/reqHandlers/editAccessCheck';

const router = express.Router();

const validateTokenId = (req, res, next) => {
  const { tokenId } = req.params;
  if (!tokenId) {
    res.status(404);
    return res.jsonp({
      success: false,
      error: 'Token ID is required',
    });
  }

  return next();
};

router.use(AuthenticationCheck);
router.use(EditAccessCheck);

router.get('/', (req, res, next) => {
  co(function *() {
    const tokens = yield AuthTokensLib.getAll();

    return res.jsonp({
      success: true,
      tokens,
    });
  }).catch((err) => {
    err.status = 500;
    err.customMsg = 'Failed to get auth tokens';
    Logger.error(err.customMsg, err);
    return next(err);
  });
});

router.get('/:tokenId', validateTokenId, (req, res, next) => {
  co(function *() {
    const { tokenId } = req.params;

    const token = yield AuthTokensLib.findById(tokenId);

    if (!token) {
      res.status(404);
      return res.jsonp({
        success: false,
        error: 'Invalid Token ID',
      });
    }

    return res.jsonp({
      success: true,
      token,
    });
  }).catch((err) => {
    err.status = 500;
    err.customMsg = 'Failed to get auth token';
    Logger.error(err.customMsg, err);
    return next(err);
  });
});

router.post('/', (req, res, next) => {
  co(function *() {
    const { userName, canEdit } = req.body;

    if (!userName) {
      res.status(400);
      return res.jsonp({
        success: false,
        error: 'User info is required',
      });
    }

    const tokenStr = uuid.v4();

    const tokenData = {
      userName,
      canEdit,
      token: tokenStr,
    };

    const token = yield AuthTokensLib.createNew(tokenData);

    return res.jsonp({
      success: true,
      token,
    });
  }).catch((err) => {
    err.status = 500;
    err.customMsg = 'Failed to save new auth token';
    Logger.error(err.customMsg, err);
    return next(err);
  });
});

router.put('/:tokenId', (req, res, next) => {
  co(function *() {
    const { tokenId } = req.params;

    let token = yield AuthTokensLib.findById(tokenId);

    if (!token) {
      res.status(404);
      return res.jsonp({
        success: false,
        error: 'Invalid Token ID',
      });
    }

    const { userName, token: tokenStr, canEdit } = req.body;

    if (!userName) {
      res.status(400);
      return res.jsonp({
        success: false,
        error: 'User info is required',
      });
    }

    const tokenData = {
      userName,
      canEdit,
      token: tokenStr,
    };

    yield AuthTokensLib.update(token._id, tokenData);
    token = yield AuthTokensLib.findById(tokenId);

    return res.jsonp({
      success: true,
      token,
    });
  }).catch((err) => {
    err.status = 500;
    err.customMsg = 'Failed to update auth token';
    Logger.error(err.customMsg, err);
    return next(err);
  });
});

router.delete('/:tokenId', (req, res, next) => {
  co(function *() {
    const { tokenId } = req.params;

    let token = yield AuthTokensLib.findById(tokenId);

    if (!token) {
      res.status(404);
      return res.jsonp({
        success: false,
        error: 'Invalid Token ID',
      });
    }

    yield AuthTokensLib.update(token._id, {
      isActive: false,
    });

    return res.jsonp({
      success: true,
    });
  }).catch((err) => {
    err.status = 500;
    err.customMsg = 'Failed to delete auth token';
    Logger.error(err.customMsg, err);
    return next(err);
  });
});

export default router;
