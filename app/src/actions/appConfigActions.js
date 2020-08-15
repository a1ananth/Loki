import {
  GET_APP_CONFIG_STARTING,
  GET_APP_CONFIG_SUCCESS,
  GET_APP_CONFIG_ERROR,

  SAVE_APP_CONFIG_STARTING,
  SAVE_APP_CONFIG_SUCCESS,
  SAVE_APP_CONFIG_ERROR,
} from '../constants/actionTypes';
import axios from "./axios";
import { apiBaseUrl } from '../constants/appConfig';

export function getAppConfigStarting() {
  return { type: GET_APP_CONFIG_STARTING, };
}

export function getAppConfigSuccess(data) {
  return { type: GET_APP_CONFIG_SUCCESS, data }
}

export function getAppConfigFailed(err) {
  return { type: GET_APP_CONFIG_ERROR, err }
}

export function getAppConfig() {
  return dispatch => (
    axios.get(`${apiBaseUrl}/app_config`).then((response) => {
      if (response && response.status === 200 && response.data.success) {
        dispatch(getAppConfigSuccess(response.data));
        return;
      }
      const err = (response && response.data && response.data.error) ?
        new Error(response.data.error) : new Error('Failed to get app config');
      dispatch(getAppConfigFailed(err));
    }).catch((err) => {
      const error = (err.response && err.response.data && err.response.data.error) ?
        new Error(err.response.data.error) : err;
      dispatch(getAppConfigFailed(error));
    }));
}

export function saveAppConfigStarting() {
  return { type: SAVE_APP_CONFIG_STARTING };
}

export function saveAppConfigSuccess(data) {
  return { type: SAVE_APP_CONFIG_SUCCESS, data }
}

export function saveAppConfigFailed(err) {
  return { type: SAVE_APP_CONFIG_ERROR, err }
}

export function saveAppConfig(postData) {
  return dispatch => (
    axios.patch(`${apiBaseUrl}/app_config`, postData).then((response) => {
      if (response && response.status === 200 && response.data.success) {
        dispatch(saveAppConfigSuccess(response.data));
        return;
      }
      const err = (response && response.data && response.data.error) ?
        new Error(response.data.error) : new Error('Failed to update app config');
      dispatch(saveAppConfigFailed(err));
    }).catch((err) => {
      const error = (err.response && err.response.data && err.response.data.error) ?
        new Error(err.response.data.error) : err;
      dispatch(saveAppConfigFailed(error));
    }));
}
