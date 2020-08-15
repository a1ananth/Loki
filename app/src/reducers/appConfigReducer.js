import clone from 'lodash/cloneDeep';
import {
  GET_APP_CONFIG_STARTING,
  GET_APP_CONFIG_SUCCESS,
  GET_APP_CONFIG_ERROR, SAVE_APP_CONFIG_SUCCESS,
} from '../constants/actionTypes';
import initialState from './initialState';

export default function appConfigReducer(state = initialState.appConfig, action) {
  switch (action.type) {
    case GET_APP_CONFIG_STARTING: {
      const newState = clone(state);
      newState.loading = true;
      newState.loaded = false;
      newState.error = null;
      return newState;
    }

    case GET_APP_CONFIG_SUCCESS: {
      const newState = clone(state);
      const { data } = action;

      newState.data = data.config;
      newState.canEdit = data.canEdit;
      newState.isPubliclyEditable = data.isPubliclyEditable;
      newState.loading = false;
      newState.loaded = true;
      return newState;
    }

    case GET_APP_CONFIG_ERROR: {
      const newState = clone(state);
      newState.loading = false;
      newState.loaded = false;
      newState.error = action.err ? action.err.message : 'Failed to get app config.';
      return newState;
    }

    case SAVE_APP_CONFIG_SUCCESS: {
      const newState = clone(state);
      const { data } = action;

      newState.data = data.config;
      return newState;
    }

    default: {
      return state;
    }
  }
}
