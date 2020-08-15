import {
  GET_SEARCH_SUGGESTIONS_STARTING,
  GET_SEARCH_SUGGESTIONS_SUCCESS,
  GET_SEARCH_SUGGESTIONS_ERROR,
} from '../constants/actionTypes';
import axios from './axios';
import { apiBaseUrl } from '../constants/appConfig';

export function getSearchSuggestionsStarting(query) {
  return { type: GET_SEARCH_SUGGESTIONS_STARTING, query };
}

export function getSearchSuggestionsSuccess(query, data) {
  return { type: GET_SEARCH_SUGGESTIONS_SUCCESS, query, data }
}

export function getSearchSuggestionsFailed(query, err) {
  return { type: GET_SEARCH_SUGGESTIONS_ERROR, query, err }
}

export function getSearchSuggestions(searchQuery) {
  return dispatch => (
    axios.get(`${apiBaseUrl}/suggest`, {
      params: {
        q: searchQuery,
      }
    }).then((response) => {
      if (response && response.status === 200) {
        dispatch(getSearchSuggestionsSuccess(searchQuery, response.data));
        return;
      }
      const err = (response && response.data && response.data.error) ?
        new Error(response.data.error) : new Error('Failed to fetch suggestions for search query');
      dispatch(getSearchSuggestionsFailed(searchQuery, err));
    }).catch((err) => {
      const error = (err.response && err.response.data && err.response.data.error) ?
        new Error(err.response.data.error) : err;
      dispatch(getSearchSuggestionsFailed(searchQuery, error));
    }));
}
