import express from 'express';
import co from 'co';
import AppConfigLib from '../lib/appConfig';
import AuthTokensLib from '../lib/authTokens';
import FilesLib from '../lib/files';
import Logger from '../logger';
import { isNil } from 'lodash';
import { createLogoImages, rewriteOpenSearchXML, updateBaseUrlInExtension } from '../lib/helpers';
import AuthenticationCheck from '../lib/reqHandlers/authenticationCheck';
import EditAccessCheck from '../lib/reqHandlers/editAccessCheck';

const router = express.Router();

router.get('/', (req, res, next) => {
  co(function *() {
    let appConfig = yield AppConfigLib.getConfiguration();
    let canEdit = false;

    const { isPubliclyEditable } = AuthTokensLib.isPubliclyEditable();

    if (isPubliclyEditable) {
      canEdit = true;
    } else {
      const { authToken } = req.cookies;
      if (authToken) {
        const tokenObj = yield AuthTokensLib.findByToken(authToken);
        if (tokenObj) {
          canEdit = tokenObj.canEdit;
        }
      }
    }

    return res.jsonp({
      success: true,
      config: appConfig,
      canEdit,
      isPubliclyEditable,
    });
  }).catch((err) => {
    err.status = 500;
    err.customMsg = 'Failed to get app config';
    Logger.error(err.customMsg, err);
    return next(err);
  });
});

router.use(AuthenticationCheck);
router.use(EditAccessCheck);

router.patch('/', (req, res, next) => {
  co(function *() {
    let appConfig = yield AppConfigLib.getConfiguration();

    const newConfig = req.body;
    delete newConfig.activeTab;

    let updateXML = false;

    // If logo is changed, generate all required images
    if (!isNil(newConfig.appearance) && !isNil(newConfig.appearance.logo) && newConfig.appearance.logo.length > 0) {
      if (isNil(appConfig.appearance) || appConfig.appearance.logo !== newConfig.appearance.logo) {
        // Logo file has changed

        const fileId = newConfig.appearance.logo;
        const fileObject = yield FilesLib.findById(fileId);

        if (!fileObject || fileObject.fileType !== 'photo') {
          res.status(400);
          res.jsonp({
            success: false,
            error: 'Logo file must be a valid image.',
          });
        }

        yield createLogoImages(fileObject);
        updateXML = true;
      }
    }

    // If Base URL has changed, update the same in extension js file
    if (!isNil(newConfig.search) && !isNil(newConfig.search.baseUrl)) {
      if (isNil(appConfig.search) || appConfig.search.baseUrl !== newConfig.search.baseUrl) {
        const newBaseUrl = newConfig.search.baseUrl;
        yield updateBaseUrlInExtension(newBaseUrl);
        updateXML = true;
      }
    }

    // If site name / tagline / base url changed, update opensearch.xml file
    if (!isNil(newConfig.appearance) && !isNil(newConfig.appearance.siteName)) {
      if (isNil(appConfig.appearance) || appConfig.appearance.siteName !== newConfig.appearance.siteName) {
        updateXML = true;
      }
    } else if (!isNil(newConfig.appearance) && !isNil(newConfig.appearance.tagline)) {
      if (isNil(appConfig.appearance) || appConfig.appearance.tagline !== newConfig.appearance.tagline) {
        updateXML = true;
      }
    }

    yield AppConfigLib.update(newConfig);
    appConfig = yield AppConfigLib.getConfiguration();

    if (updateXML) {
      yield rewriteOpenSearchXML(appConfig);
    }

    return res.jsonp({
      success: true,
      config: appConfig,
    });
  }).catch((err) => {
    err.status = 500;
    err.customMsg = 'Failed to save app config';
    Logger.error(err.customMsg, err);
    return next(err);
  });
});

export default router;
