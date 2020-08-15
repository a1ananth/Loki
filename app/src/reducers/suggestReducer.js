import { cloneDeep } from 'lodash';
import {
  GET_SEARCH_SUGGESTIONS_STARTING,
  GET_SEARCH_SUGGESTIONS_SUCCESS,
  GET_SEARCH_SUGGESTIONS_ERROR,
} from '../constants/actionTypes';
import initialState from './initialState';

export default function suggestReducer(state = initialState.searchSuggestions, action) {
  switch (action.type) {
    case GET_SEARCH_SUGGESTIONS_STARTING: {
      const { query } = action;
      const newState = cloneDeep(state);

      if (!newState[query]) {
        newState[query] = cloneDeep(initialState.searchSuggestions.query);
      }

      const suggestionData = newState[query];
      suggestionData.suggestions = [];
      suggestionData.links = {};
      suggestionData.loading = true;
      suggestionData.loaded = false;
      suggestionData.error = null;
      return newState;
    }

    case GET_SEARCH_SUGGESTIONS_SUCCESS: {
      const { query, data } = action;
      const newState = cloneDeep(state);

      if (!newState[query]) {
        newState[query] = cloneDeep(initialState.searchSuggestions.query);
      }

      // const query = data[0];
      const suggestionsArr = data[1];
      // const resultCountsArr = data[2];
      const linksArr = data[3];
      const linksMap = {};

      linksArr.forEach((link, index) => {
        linksMap[index] = link;
      });

      const suggestionData = newState[query];
      suggestionData.suggestions = suggestionsArr;
      suggestionData.links = linksMap;
      suggestionData.loading = false;
      suggestionData.loaded = true;
      suggestionData.error = null;
      return newState;
    }

    case GET_SEARCH_SUGGESTIONS_ERROR: {
      const { query } = action;
      const newState = cloneDeep(state);

      if (!newState[query]) {
        newState[query] = cloneDeep(initialState.searchSuggestions.query);
      }

      const suggestionData = newState[query];
      suggestionData.loading = false;
      suggestionData.loaded = false;
      suggestionData.error = action.err ? action.err.message : 'Failed to load suggestions for global search.';
      return newState;
    }

    default: {
      return state;
    }
  }
}
