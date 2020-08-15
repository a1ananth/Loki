import axios from 'axios';
import {
  FILE_UPLOAD_ERROR,
  FILE_UPLOAD_STARTING,
  FILE_UPLOAD_SUCCESS,
} from '../constants/actionTypes';
import { apiBaseUrl } from '../constants/appConfig';

export function uploadFileStarting() {
  return { type: FILE_UPLOAD_STARTING };
}

export function uploadFileSuccess(data) {
  return { type: FILE_UPLOAD_SUCCESS, data };
}

export function uploadFileFailed(err) {
  return { type: FILE_UPLOAD_ERROR, err };
}

export function uploadFile(file) {
  return (dispatch) => {
    dispatch(uploadFileStarting());

    const data = new FormData();
    data.append('file', file);

    axios.post(`${apiBaseUrl}/files`, data,{
      headers: {'Content-Type': 'multipart/form-data' }
    }).then((response) => {
      if (response && response.status === 200 && response.data.success) {
        dispatch(uploadFileSuccess(response.data));
        return;
      }

      const err = (response && response.data && response.data.error) ?
        response.data.error : 'Failed to upload file.';
      dispatch(uploadFileFailed(err));
    }).catch((err) => {
      const error = (err.response && err.response.data && err.response.data.error) ?
        err.response.data.error : err.message;
      dispatch(uploadFileFailed(error));
    });
  };
}
