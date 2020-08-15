import mongoose from 'mongoose';
import { merge } from 'lodash';
import SearchHit from './models/SearchHit';

const SearchHitsLib = {};

SearchHitsLib.findById = (_id) => {
  return SearchHit.findOne({
    _id,
  });
};

SearchHitsLib.findByQuery = (query) => {
  return SearchHit.findOne({
    query,
  });
};

SearchHitsLib.createNew = (searchResultData) => {
  const searchResult = new SearchHit();
  searchResult._id = new mongoose.Types.ObjectId;
  merge(searchResult, searchResultData);
  return searchResult.save();
};

export default SearchHitsLib;
