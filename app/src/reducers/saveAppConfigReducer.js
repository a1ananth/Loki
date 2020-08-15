import { cloneDeep } from 'lodash';
import {
  SAVE_APP_CONFIG_STARTING,
  SAVE_APP_CONFIG_SUCCESS,
  SAVE_APP_CONFIG_ERROR,
} from '../constants/actionTypes';
import initialState from './initialState';

export default function saveAppConfigReducer(state = initialState.saveAppConfig, action) {
  switch (action.type) {
    case SAVE_APP_CONFIG_STARTING: {
      const newState = cloneDeep(state);
      newState.saving = true;
      newState.saved = false;
      return newState;
    }

    case SAVE_APP_CONFIG_SUCCESS: {
      const newState = cloneDeep(state);
      newState.saving = false;
      newState.saved = true;
      return newState;
    }

    case SAVE_APP_CONFIG_ERROR: {
      const newState = cloneDeep(state);
      newState.saving = false;
      newState.saved = false;
      newState.error = action.err ? action.err.message : 'Failed to save app config.';
      return newState;
    }

    default: {
      return state;
    }
  }
}
