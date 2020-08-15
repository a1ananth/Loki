import express from 'express';
import co from 'co';
import cfg from '../cfg';
import Logger from '../logger';
import AuthenticationCheck from '../lib/reqHandlers/authenticationCheck';
import EditAccessCheck from '../lib/reqHandlers/editAccessCheck';
import { renderReactApp } from '../lib/reqHandlers/renderReactApp';
import SearchResultsLib from '../lib/searchResults';
import SearchHitsLib from '../lib/searchHits';
import AppConfigLib from '../lib/appConfig';

const router = express.Router();

router.get('/', (req, res, next) => {
  co(function*() {
    let { q: query } = req.query;

    if (!query) {
      return renderReactApp(req, res);
    }

    query = query.toLowerCase();

    let result = yield SearchResultsLib.findByQuery(query);

    if (!result) {
      const searchResultData = {
        query,
      };

      result = yield SearchResultsLib.createNew(searchResultData);
    } else if (result && !result.isActive) {
      // TODO Handle
      // For now, inactive results just follow through as if they are active
    }

    const appConfig = yield AppConfigLib.getConfiguration();

    if (!result.resultType) {
      if (appConfig.privacy && appConfig.privacy.trackSearchCount) {
        yield SearchResultsLib.incrementSearchCount(result);
      }

      if (appConfig.privacy && appConfig.privacy.saveUserInfo) {
        yield SearchHitsLib.createNew({
          query,
          ipAddress: req.ip,
          userAgent: req.header('user-agent'),
          headers: req.headers,
        });
      }

      const defaultSearchEngineUrl = (appConfig.search && appConfig.search.defaultSearchEngineUrl) ?
        appConfig.search.defaultSearchEngineUrl : cfg.search.defaultSearchEngineUrl;
      const redirectTo = defaultSearchEngineUrl.replace('%s', query);
      res.redirect(redirectTo);

      return;
    }

    // TODO Check for Authentication

    if (result.resultType === 'redirect') {
      if (result.targetUrl) {
        if (appConfig.privacy && appConfig.privacy.trackSearchCount) {
          yield SearchResultsLib.incrementSearchCount(result);
        }

        if (appConfig.privacy && appConfig.privacy.saveUserInfo) {
          yield SearchHitsLib.createNew({
            query,
            ipAddress: req.ip,
            userAgent: req.header('user-agent'),
            headers: req.headers,
          });
        }

        res.redirect(result.targetUrl);
        return;
      }
    }

    return renderReactApp(req, res);
  }).catch((err) => {
    err.status = 500;
    err.customMsg = 'Failed to get search result';
    Logger.error(err.customMsg, err);
    return next(err);
  });
});

router.use(AuthenticationCheck);

router.post('/', (req, res, next) => {
  let { q: query } = req.body;

  if (!query) {
    res.status(400);
    return res.jsonp({
      success: false,
      error: 'Search query empty',
    });
  }

  query = query.toLowerCase();

  co(function*() {
    let result = yield SearchResultsLib.findByQuery(query);

    if (!result) {
      const searchResultData = {
        query,
      };

      result = yield SearchResultsLib.createNew(searchResultData);
    } else if (result && !result.isActive) {
      // TODO Record search hit
      return res.jsonp({
        success: false,
        error: 'Page removed',
      });
    }

    const appConfig = yield AppConfigLib.getConfiguration();

    if (appConfig.privacy && appConfig.privacy.trackSearchCount) {
      yield SearchResultsLib.incrementSearchCount(result);
    }

    if (appConfig.privacy && appConfig.privacy.saveUserInfo) {
      yield SearchHitsLib.createNew({
        query,
        ipAddress: req.ip,
        userAgent: req.header('user-agent'),
        headers: req.headers,
      });
    }

    const resultInfo = yield SearchResultsLib.extractUsefulInfo(result);

    return res.jsonp({
      success: true,
      canEdit: true,
      ...resultInfo,
    });
  }).catch((err) => {
    err.status = 500;
    err.customMsg = 'Failed to get search result';
    Logger.error(err.customMsg, err);
    return next(err);
  });
});

router.use(EditAccessCheck);

router.post('/save_result', (req, res, next) => {
  let {
    q: query, resultType, targetUrl, fixedText, fixedTextType, wikiPageName,
    prefixStr, word,
    lang,
    meanings,
    synonyms,
    antonyms,
    searchCount,
    notes,
  } = req.body;

  if (!query) {
    res.status(400);
    return res.jsonp({
      success: false,
      error: 'Search query cannot be empty',
    });
  }

  query = query.toLowerCase();

  co(function*() {
    let result = yield SearchResultsLib.findByQuery(query);

    if (!result) {
      const searchResultData = {
        query,
      };

      result = yield SearchResultsLib.createNew(searchResultData);
    } else if (result && !result.isActive) {
      // TODO Handle bad page
      return res.jsonp({
        success: false,
        result: null,
        canEdit: false,
        error: 'This search result cannot be edited at this time.',
      });
    }

    // TODO Validate data
    // Mainly resultType and then applicable parameters

    const updateData = {};
    updateData.resultType = resultType;
    updateData.notes = notes;

    if (searchCount !== result.searchCount) {
      updateData.searchCount = searchCount;
    }

    switch (resultType) {
      case 'redirect': {
        updateData.targetUrl = targetUrl;
        break;
      }

      case 'fixed_text': {
        updateData.fixedText = fixedText;
        updateData.fixedTextType = fixedTextType;
        break;
      }
    }

    yield SearchResultsLib.updateOne(result._id, updateData);

    result = yield SearchResultsLib.findByQuery(query);
    const resultInfo = yield SearchResultsLib.extractUsefulInfo(result);

    return res.jsonp({
      success: true,
      ...resultInfo,
    });
  }).catch((err) => {
    err.status = 500;
    err.customMsg = 'Failed to save search result';
    Logger.error(err.customMsg, err);
    return next(err);
  });
});

export default router;
