import {
  GET_AUTH_TOKENS_STARTING,
  GET_AUTH_TOKENS_SUCCESS,
  GET_AUTH_TOKENS_ERROR,

  CREATE_AUTH_TOKEN_STARTING,
  CREATE_AUTH_TOKEN_SUCCESS,
  CREATE_AUTH_TOKEN_ERROR,

  UPDATE_AUTH_TOKEN_STARTING, UPDATE_AUTH_TOKEN_SUCCESS, UPDATE_AUTH_TOKEN_ERROR,
  DELETE_AUTH_TOKEN_STARTING, DELETE_AUTH_TOKEN_SUCCESS, DELETE_AUTH_TOKEN_ERROR,
} from '../constants/actionTypes';
import axios from "./axios";
import { apiBaseUrl } from '../constants/appConfig';

export function getAuthTokensStarting() {
  return { type: GET_AUTH_TOKENS_STARTING, };
}

export function getAuthTokensSuccess(data) {
  return { type: GET_AUTH_TOKENS_SUCCESS, data }
}

export function getAuthTokensFailed(err) {
  return { type: GET_AUTH_TOKENS_ERROR, err }
}

export function getAuthTokens() {
  return dispatch => (
    axios.get(`${apiBaseUrl}/auth_tokens`).then((response) => {
      if (response && response.status === 200 && response.data.success) {
        dispatch(getAuthTokensSuccess(response.data));
        return;
      }
      const err = (response && response.data && response.data.error) ?
        new Error(response.data.error) : new Error('Failed to get auth tokens');
      dispatch(getAuthTokensFailed(err));
    }).catch((err) => {
      const error = (err.response && err.response.data && err.response.data.error) ?
        new Error(err.response.data.error) : err;
      dispatch(getAuthTokensFailed(error));
    }));
}

export function createAuthTokenStarting() {
  return { type: CREATE_AUTH_TOKEN_STARTING };
}

export function createAuthTokenSuccess(data) {
  return { type: CREATE_AUTH_TOKEN_SUCCESS, data }
}

export function createAuthTokenFailed(err) {
  return { type: CREATE_AUTH_TOKEN_ERROR, err }
}

export function createAuthToken(tokenData) {
  return dispatch => (
    axios.post(`${apiBaseUrl}/auth_tokens`, tokenData).then((response) => {
      if (response && response.status === 200 && response.data.success) {
        dispatch(createAuthTokenSuccess(response.data));
        return;
      }
      const err = (response && response.data && response.data.error) ?
        new Error(response.data.error) : new Error('Failed to create auth token');
      dispatch(createAuthTokenFailed(err));
    }).catch((err) => {
      const error = (err.response && err.response.data && err.response.data.error) ?
        new Error(err.response.data.error) : err;
      dispatch(createAuthTokenFailed(error));
    }));
}

export function updateAuthTokenStarting(tokenId) {
  return { type: UPDATE_AUTH_TOKEN_STARTING, tokenId };
}

export function updateAuthTokenSuccess(tokenId, data) {
  return { type: UPDATE_AUTH_TOKEN_SUCCESS, tokenId, data }
}

export function updateAuthTokenFailed(tokenId, err) {
  return { type: UPDATE_AUTH_TOKEN_ERROR, tokenId, err }
}

export function updateAuthToken(tokenId, tokenData) {
  return dispatch => (
    axios.put(`${apiBaseUrl}/auth_tokens/${tokenId}`, tokenData).then((response) => {
      if (response && response.status === 200 && response.data.success) {
        dispatch(updateAuthTokenSuccess(tokenId, response.data));
        return;
      }
      const err = (response && response.data && response.data.error) ?
        new Error(response.data.error) : new Error('Failed to update auth token');
      dispatch(updateAuthTokenFailed(tokenId, err));
    }).catch((err) => {
      const error = (err.response && err.response.data && err.response.data.error) ?
        new Error(err.response.data.error) : err;
      dispatch(updateAuthTokenFailed(tokenId, error));
    }));
}

export function deleteAuthTokenStarting(tokenId) {
  return { type: DELETE_AUTH_TOKEN_STARTING, tokenId };
}

export function deleteAuthTokenSuccess(tokenId, data) {
  return { type: DELETE_AUTH_TOKEN_SUCCESS, tokenId, data }
}

export function deleteAuthTokenFailed(tokenId, err) {
  return { type: DELETE_AUTH_TOKEN_ERROR, tokenId, err }
}

export function deleteAuthToken(tokenId) {
  return dispatch => (
    axios.delete(`${apiBaseUrl}/auth_tokens/${tokenId}`).then((response) => {
      if (response && response.status === 200 && response.data.success) {
        dispatch(deleteAuthTokenSuccess(tokenId, response.data));
        return;
      }
      const err = (response && response.data && response.data.error) ?
        new Error(response.data.error) : new Error('Failed to delete auth token');
      dispatch(deleteAuthTokenFailed(tokenId, err));
    }).catch((err) => {
      const error = (err.response && err.response.data && err.response.data.error) ?
        new Error(err.response.data.error) : err;
      dispatch(deleteAuthTokenFailed(tokenId, error));
    }));
}
