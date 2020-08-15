import clone from 'lodash/cloneDeep';
import {
  CREATE_AUTH_TOKEN_STARTING,
  CREATE_AUTH_TOKEN_SUCCESS,
  CREATE_AUTH_TOKEN_ERROR,
} from '../constants/actionTypes';
import initialState from './initialState';

export default function createAuthTokenReducer(state = initialState.createAuthToken, action) {
  switch (action.type) {
    case CREATE_AUTH_TOKEN_STARTING: {
      const newState = clone(state);
      newState.saving = true;
      newState.saved = false;
      return newState;
    }

    case CREATE_AUTH_TOKEN_SUCCESS: {
      const newState = clone(state);
      newState.saving = false;
      newState.saved = true;
      newState.error = null;

      return newState;
    }

    case CREATE_AUTH_TOKEN_ERROR: {
      const newState = clone(state);
      newState.saving = false;
      newState.saved = false;
      newState.error = action.err ? action.err.message : 'Failed to create auth token';

      return newState;
    }

    default: {
      return state;
    }
  }
}
