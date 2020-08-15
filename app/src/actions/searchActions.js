import {
  GET_SEARCH_RESULT_STARTING,
  GET_SEARCH_RESULT_SUCCESS,
  GET_SEARCH_RESULT_ERROR, SAVE_SEARCH_RESULT_STARTING, SAVE_SEARCH_RESULT_SUCCESS, SAVE_SEARCH_RESULT_ERROR,
} from '../constants/actionTypes';
import axios from "./axios";
import { apiBaseUrl } from '../constants/appConfig';

export function getSearchResultStarting(query) {
  return { type: GET_SEARCH_RESULT_STARTING, query };
}

export function getSearchResultSuccess(query, data) {
  return { type: GET_SEARCH_RESULT_SUCCESS, query, data }
}

export function getSearchResultFailed(query, err) {
  return { type: GET_SEARCH_RESULT_ERROR, query, err }
}

export function getSearchResult(query) {
  return dispatch => (
    axios.post(`${apiBaseUrl}/search`, {
      q: query,
    }).then((response) => {
      if (response && response.status === 200 && response.data.success) {
        dispatch(getSearchResultSuccess(query, response.data));
        return;
      }
      const err = (response && response.data && response.data.error) ?
        new Error(response.data.error) : new Error('Failed to get search result');
      dispatch(getSearchResultFailed(query, err));
    }).catch((err) => {
      const error = (err.response && err.response.data && err.response.data.error) ?
        new Error(err.response.data.error) : err;
      dispatch(getSearchResultFailed(query, error));
    }));
}

export function saveSearchResultStarting(query) {
  return { type: SAVE_SEARCH_RESULT_STARTING, query };
}

export function saveSearchResultSuccess(query, data) {
  return { type: SAVE_SEARCH_RESULT_SUCCESS, query, data }
}

export function saveSearchResultFailed(query, err) {
  return { type: SAVE_SEARCH_RESULT_ERROR, query, err }
}

export function saveSearchResult(query, state) {
  return dispatch => (
    axios.post(`${apiBaseUrl}/search/save_result`, {
      q: query,
      ...state,
    }).then((response) => {
      if (response && response.status === 200 && response.data.success) {
        dispatch(saveSearchResultSuccess(query, response.data));
        return;
      }
      const err = (response && response.data && response.data.error) ?
        new Error(response.data.error) : new Error('Failed to save search result');
      dispatch(saveSearchResultFailed(query, err));
    }).catch((err) => {
      const error = (err.response && err.response.data && err.response.data.error) ?
        new Error(err.response.data.error) : err;
      dispatch(saveSearchResultFailed(query, error));
    }));
}
