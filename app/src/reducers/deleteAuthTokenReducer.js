import { cloneDeep } from 'lodash';
import {
  DELETE_AUTH_TOKEN_STARTING,
  DELETE_AUTH_TOKEN_SUCCESS,
  DELETE_AUTH_TOKEN_ERROR,
} from '../constants/actionTypes';
import initialState from './initialState';

export default function deleteAuthTokenReducer(state = initialState.deleteAuthToken, action) {
  switch (action.type) {
    case DELETE_AUTH_TOKEN_STARTING: {
      const { tokenId } = action;
      const newState = cloneDeep(state);

      if (!newState[tokenId]) {
        newState[tokenId] = cloneDeep(initialState.deleteAuthToken.tokenId);
      }

      const deleteData = newState[tokenId];
      deleteData.saving = true;
      deleteData.saved = false;
      deleteData.error = null;
      return newState;
    }

    case DELETE_AUTH_TOKEN_SUCCESS: {
      const { tokenId } = action;
      const newState = cloneDeep(state);

      if (!newState[tokenId]) {
        newState[tokenId] = cloneDeep(initialState.deleteAuthToken.tokenId);
      }

      const deleteData = newState[tokenId];
      deleteData.saving = false;
      deleteData.saved = true;
      return newState;
    }

    case DELETE_AUTH_TOKEN_ERROR: {
      const { tokenId } = action;
      const newState = cloneDeep(state);

      if (!newState[tokenId]) {
        newState[tokenId] = cloneDeep(initialState.deleteAuthToken.tokenId);
      }

      const deleteData = newState[tokenId];
      deleteData.saving = false;
      deleteData.saved = false;
      deleteData.error = action.err ? action.err.message : 'Failed to delete token data';
      return newState;
    }

    default: {
      return state;
    }
  }
}
