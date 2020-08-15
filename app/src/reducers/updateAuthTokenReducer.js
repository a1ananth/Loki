import { cloneDeep } from 'lodash';
import {
  UPDATE_AUTH_TOKEN_STARTING,
  UPDATE_AUTH_TOKEN_SUCCESS,
  UPDATE_AUTH_TOKEN_ERROR,
} from '../constants/actionTypes';
import initialState from './initialState';

export default function updateAuthTokenReducer(state = initialState.updateAuthToken, action) {
  switch (action.type) {
    case UPDATE_AUTH_TOKEN_STARTING: {
      const { tokenId } = action;
      const newState = cloneDeep(state);

      if (!newState[tokenId]) {
        newState[tokenId] = cloneDeep(initialState.updateAuthToken.tokenId);
      }

      const updateData = newState[tokenId];
      updateData.saving = true;
      updateData.saved = false;
      updateData.error = null;
      return newState;
    }

    case UPDATE_AUTH_TOKEN_SUCCESS: {
      const { tokenId } = action;
      const newState = cloneDeep(state);

      if (!newState[tokenId]) {
        newState[tokenId] = cloneDeep(initialState.updateAuthToken.tokenId);
      }

      const updateData = newState[tokenId];
      updateData.saving = false;
      updateData.saved = true;
      return newState;
    }

    case UPDATE_AUTH_TOKEN_ERROR: {
      const { tokenId } = action;
      const newState = cloneDeep(state);

      if (!newState[tokenId]) {
        newState[tokenId] = cloneDeep(initialState.updateAuthToken.tokenId);
      }

      const updateData = newState[tokenId];
      updateData.saving = false;
      updateData.saved = false;
      updateData.error = action.err ? action.err.message : 'Failed to update token data';
      return newState;
    }

    default: {
      return state;
    }
  }
}
