import clone from 'lodash/cloneDeep';
import {
  FILE_UPLOAD_STARTING,
  FILE_UPLOAD_SUCCESS,
  FILE_UPLOAD_ERROR,
} from '../constants/actionTypes';
import initialState from './initialState';

export default function fileUploadStatusReducer(state = initialState.fileUploadStatus, action) {
  switch (action.type) {
    case FILE_UPLOAD_STARTING: {
      const newState = clone(state);
      newState.uploading = true;
      newState.uploaded = false;
      return newState;
    }

    case FILE_UPLOAD_SUCCESS: {
      const { data } = action;

      const newState = clone(state);
      newState.uploading = false;
      newState.uploaded = true;
      newState.error = null;
      console.log(data);

      newState.file = data.file;

      return newState;
    }

    case FILE_UPLOAD_ERROR: {
      const newState = clone(state);
      newState.uploading = false;
      newState.uploaded = false;
      newState.error = action.err;

      return newState;
    }

    default: {
      return state;
    }
  }
}
