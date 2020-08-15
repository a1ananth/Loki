import { cloneDeep } from 'lodash';
import {
  GET_SEARCH_RESULT_STARTING,
  GET_SEARCH_RESULT_SUCCESS,
  GET_SEARCH_RESULT_ERROR, SAVE_SEARCH_RESULT_SUCCESS,
} from '../constants/actionTypes';
import initialState from './initialState';

export default function searchResultsReducer(state = initialState.searchResults, action) {
  switch (action.type) {
    case GET_SEARCH_RESULT_STARTING: {
      const { query } = action;
      const newState = cloneDeep(state);

      if (!newState[query]) {
        newState[query] = cloneDeep(initialState.searchResults.query);
      }

      const searchResultData = newState[query];
      searchResultData.loading = true;
      searchResultData.loaded = false;
      searchResultData.error = null;
      return newState;
    }

    case GET_SEARCH_RESULT_SUCCESS: {
      const { query, data } = action;
      const newState = cloneDeep(state);

      if (!newState[query]) {
        newState[query] = cloneDeep(initialState.searchResults.query);
      }

      const searchResultData = newState[query];
      searchResultData.loading = false;
      searchResultData.loaded = true;
      searchResultData.result = data.result;
      searchResultData.webPages = data.webPages;
      return newState;
    }

    case GET_SEARCH_RESULT_ERROR: {
      const { query } = action;
      const newState = cloneDeep(state);

      if (!newState[query]) {
        newState[query] = cloneDeep(initialState.searchResults.query);
      }

      const searchResultData = newState[query];
      searchResultData.loading = false;
      searchResultData.loaded = false;
      searchResultData.error = action.err ? action.err.message : 'Failed to get search result';
      return newState;
    }

    case SAVE_SEARCH_RESULT_SUCCESS: {
      const { query, data } = action;
      const newState = cloneDeep(state);

      if (!newState[query]) {
        newState[query] = cloneDeep(initialState.searchResults.query);
      }

      const searchResultData = newState[query];
      searchResultData.loading = false;
      searchResultData.loaded = true;
      searchResultData.result = data.result;
      searchResultData.webPages = data.webPages;
      searchResultData.wikiPage = data.wikiPage;
      searchResultData.prefixData = data.prefixData;
      return newState;
    }

    default: {
      return state;
    }
  }
}
