import { cloneDeep } from 'lodash';
import {
  SAVE_SEARCH_RESULT_STARTING,
  SAVE_SEARCH_RESULT_SUCCESS,
  SAVE_SEARCH_RESULT_ERROR,
} from '../constants/actionTypes';
import initialState from './initialState';

export default function saveSearchResultReducer(state = initialState.saveSearchResult, action) {
  switch (action.type) {
    case SAVE_SEARCH_RESULT_STARTING: {
      const { query } = action;
      const newState = cloneDeep(state);

      if (!newState[query]) {
        newState[query] = cloneDeep(initialState.saveSearchResult.query);
      }

      const saveSearchResultData = newState[query];
      saveSearchResultData.saving = true;
      saveSearchResultData.saved = false;
      saveSearchResultData.error = null;
      return newState;
    }

    case SAVE_SEARCH_RESULT_SUCCESS: {
      const { query } = action;
      const newState = cloneDeep(state);

      if (!newState[query]) {
        newState[query] = cloneDeep(initialState.saveSearchResult.query);
      }

      const saveSearchResultData = newState[query];
      saveSearchResultData.saving = false;
      saveSearchResultData.saved = true;
      return newState;
    }

    case SAVE_SEARCH_RESULT_ERROR: {
      const { query } = action;
      const newState = cloneDeep(state);

      if (!newState[query]) {
        newState[query] = cloneDeep(initialState.saveSearchResult.query);
      }

      const saveSearchResultData = newState[query];
      saveSearchResultData.saving = false;
      saveSearchResultData.saved = false;
      saveSearchResultData.error = action.err ? action.err.message : '';
      return newState;
    }

    default: {
      return state;
    }
  }
}
