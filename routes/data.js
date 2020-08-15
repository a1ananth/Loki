import express from 'express';
import url from 'url';
import co from 'co';
import cfg from '../cfg';
import SearchResultsLib from '../lib/searchResults';
import WebPagesLib from '../lib/webPages';
import Logger from '../logger';

const router = express.Router();

router.post('/search_results', (req, res, next) => {
  let { source, searchResults, url: urlStr } = req.body;

  if (!source) {
    Logger.debug(1);
    res.status(400);
    return res.jsonp({
      success: false,
      error: 'Source of search results is required',
    });
  }

  if (source !== 'duckduckgo' && source !== 'google') {
    res.status(400);
    return res.jsonp({
      success: false,
      error: 'This source is not supported',
    });
  }

  if (!searchResults || !searchResults.length) {
    Logger.debug(2);
    res.status(400);
    return res.jsonp({
      success: false,
      error: 'No search results found',
    });
  }

  if (!urlStr || !urlStr.length) {
    Logger.debug(3);
    res.status(400);
    return res.jsonp({
      success: false,
      error: 'URL is required',
    });
  }

  const url_parts = url.parse(urlStr, true);
  let query = (url_parts && url_parts.query) ? url_parts.query.q : '';

  if (!query) {
    Logger.debug(4);
    res.status(400);
    return res.jsonp({
      success: false,
      error: 'Unable to extract search query from URL',
    });
  }

  query = query.toLowerCase();

  try {
    searchResults = JSON.parse(searchResults);
  } catch (err) {
    Logger.error('Failed to parse search results json', err);
    //Logger.debug('JSON data was: ', searchResults);

    res.status(400);
    return res.jsonp({
      success: false,
      error: 'Failed to parse search results json',
    });
  }

  co(function*() {
    let result = yield SearchResultsLib.findByQuery(query);

    if (!result) {
      result = yield SearchResultsLib.createNew({
        query,
      });
    }

    const webPageIds = yield WebPagesLib.createFromSearchResults(searchResults);

    if (source === 'duckduckgo') {
      const oldIds = (result.ddgResults && result.ddgResults.length) ? result.ddgResults : [];

      const updateData = {
        ddgResults: yield WebPagesLib.mergeIds(oldIds, webPageIds),
      };

      if (!result.resultType) {
        updateData.resultType = 'meta_search';
      }

      yield SearchResultsLib.updateOne(result._id, updateData);
    } else if (source === 'google') {
      const oldIds = (result.googleResults && result.googleResults.length) ? result.googleResults : [];

      const updateData = {
        googleResults: yield WebPagesLib.mergeIds(oldIds, webPageIds),
      };

      if (!result.resultType) {
        updateData.resultType = 'meta_search';
      }

      yield SearchResultsLib.updateOne(result._id, updateData);
    }

    return res.jsonp({
      success: true,
    });
  }).catch((err) => {
    err.status = 500;
    err.customMsg = 'Failed to save search results';
    Logger.error(err.customMsg, err);
    return next(err);
  });
});

router.post('/videos', (req, res, next) => {
  Logger.debug(req.body);

  return res.jsonp({
    success: false,
    error: 'Not implemented yet',
  });
});

export default router;
