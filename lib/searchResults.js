import mongoose from 'mongoose';
import { cloneDeep, merge } from 'lodash';
import SearchResult from './models/SearchResult';
import WebPagesLib from './webPages';
import WikiPagesLib from './wikiPages';
import Logger from '../logger';

const SearchResultsLib = {};

SearchResultsLib.findById = (_id) => {
  return SearchResult.findOne({
    _id,
  });
};

SearchResultsLib.findByConds = (conds) => {
  return SearchResult.find(conds);
};

SearchResultsLib.findOneByConds = (conds) => {
  return SearchResult.findOne(conds);
};

SearchResultsLib.findByQuery = (query) => {
  return SearchResult.findOne({
    query,
  });
};

SearchResultsLib.createNew = (searchResultData) => {
  const searchResult = new SearchResult();
  searchResult._id = new mongoose.Types.ObjectId;
  merge(searchResult, searchResultData);
  return searchResult.save();
};

SearchResultsLib.updateOne = (_id, updateData) => {
  if (!updateData.updatedAt) {
    updateData.updatedAt = new Date();
  }

  return SearchResult.updateOne({
    _id,
  }, {
    $set: updateData,
  });
};

SearchResultsLib.incrementSearchCount = async (searchResult = null, query = '') => {
  if (searchResult === null && query.length) {
    searchResult = await SearchResultsLib.findByQuery(query);
  }

  if (searchResult === null) {
    throw new Error('Search result and query atleast one parameter is required');
  }

  return SearchResult.updateOne({
    _id: searchResult._id,
  }, {
    $inc: {
      searchCount: 1,
    },
    $set: {
      updatedAt: new Date(),
    },
  });
};

SearchResultsLib.findQueryPrefixMatch = (query) => {
  return SearchResult.find({
    query: new RegExp('^' + query, 'i'),
  }).sort({ searchCount: -1 }).limit(10);
};

SearchResultsLib.getTopSuggestions = () => {
  return SearchResult.find({}).sort({ searchCount: -1 }).limit(10);
};

SearchResultsLib.extractUsefulInfo = async (result) => {
  let webPages = {};
  let wikiPage = {};
  let modifiedResult = cloneDeep(result);

  //Logger.debug('Result type is ', result.resultType);

  switch (result.resultType) {
    case 'redirect': {
      delete modifiedResult.ddgResults;
      delete modifiedResult.googleResults;
      break;
    }

    case 'meta_search': {
      let { ddgResults, googleResults } = result;
      if (!ddgResults) {
        ddgResults = [];
      }

      if (!googleResults) {
        googleResults = [];
      }

      const allResultIds = ddgResults.concat(googleResults);
      const webPageResults = await WebPagesLib.findByIds(allResultIds);
      webPageResults.forEach((r) => {
        webPages[r._id] = r;
      });

      break;
    }

    default: {
      break;
    }
  }

  return {
    result: modifiedResult,
    webPages,
    wikiPage,
  };
};

export default SearchResultsLib;
