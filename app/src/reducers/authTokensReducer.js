import clone from 'lodash/cloneDeep';
import {
  GET_AUTH_TOKENS_STARTING,
  GET_AUTH_TOKENS_SUCCESS,
  GET_AUTH_TOKENS_ERROR,

  CREATE_AUTH_TOKEN_SUCCESS,
  UPDATE_AUTH_TOKEN_SUCCESS, DELETE_AUTH_TOKEN_SUCCESS,
} from '../constants/actionTypes';
import initialState from './initialState';

export default function authTokensReducer(state = initialState.authTokens, action) {
  switch (action.type) {
    case GET_AUTH_TOKENS_STARTING: {
      const newState = clone(state);
      newState.loading = true;
      newState.loaded = false;
      newState.error = null;
      return newState;
    }

    case GET_AUTH_TOKENS_SUCCESS: {
      const newState = clone(state);
      const { data } = action;

      const ids = [];
      const map = {};

      data.tokens.forEach((token) => {
        ids.push(token._id);
        map[token._id] = token;
      });

      newState.loading = false;
      newState.loaded = true;
      newState.ids = ids;
      newState.map = map;
      return newState;
    }

    case GET_AUTH_TOKENS_ERROR: {
      const newState = clone(state);
      newState.loading = false;
      newState.loaded = false;
      newState.error = action.err ? action.err.message : 'Failed to get auth tokens.';
      return newState;
    }

    case CREATE_AUTH_TOKEN_SUCCESS: {
      const newState = clone(state);
      const { token } = action.data;
      newState.ids.push(token._id);
      newState.map[token._id] = token;
      return newState;
    }

    case UPDATE_AUTH_TOKEN_SUCCESS: {
      const newState = clone(state);
      const { token } = action.data;
      newState.map[token._id] = token;
      return newState;
    }

    case DELETE_AUTH_TOKEN_SUCCESS: {
      const newState = clone(state);
      const { tokenId } = action;
      newState.ids = newState.ids.filter(id => id !== tokenId);
      delete newState.map[tokenId];
      return newState;
    }

    default: {
      return state;
    }
  }
}
