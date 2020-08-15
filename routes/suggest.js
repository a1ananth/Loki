import express from 'express';
import path from 'path';
import fs from 'fs';
import { isNil, isNaN } from 'lodash';
import co from 'co';
import SearchResultsLib from '../lib/searchResults';
import WebPagesLib from '../lib/webPages';
import WikiPagesLib from '../lib/wikiPages';
import cfg from '../cfg';
import Logger from '../logger';

const router = express.Router();

router.get('/', (req, res, next) => {
  let { q: query } = req.query;

  if (query) {
    query = query.toLowerCase();
  }

  co(function*() {
    // TODO Improve suggestions logic later

    // TODO Suggestions need to be ordered by some kind of score

    // TODO Use redis cache for suggestions

    let suggestions;

    if (!query) {
      suggestions = yield SearchResultsLib.getTopSuggestions(query);
    } else {
      suggestions = yield SearchResultsLib.findQueryPrefixMatch(query);
    }

    const suggestionsArr = [];
    const resultCountsArr = [];
    const linksArr = [];

    if (suggestions.length > 0) {
      suggestions.forEach((result) => {
        suggestionsArr.push(result.query);
        resultCountsArr.push('');
        // TODO Fix URL

        if (result.resultType === 'redirect') {
          linksArr.push(result.targetUrl);
        } else {
          linksArr.push('http://localhost:9192/search?q=' + result.query);
        }
      });
    }

    const responseData = [
      query,
      suggestionsArr,
      resultCountsArr,
      linksArr,
    ];
    return res.jsonp(responseData);
  }).catch((err) => {
    err.status = 500;
    err.customMsg = 'Failed to get search result';
    Logger.error(err.customMsg, err);
    return next(err);
  });
});

export default router;
