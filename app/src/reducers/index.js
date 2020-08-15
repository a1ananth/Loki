import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import appConfig from './appConfigReducer';
import authTokens from './authTokensReducer';
import createAuthToken from './createAuthTokenReducer';
import deleteAuthToken from './deleteAuthTokenReducer';
import fileUploadStatus from './fileUploadStatusReducer';
import saveAppConfig from './saveAppConfigReducer';
import saveSearchResult from './saveSearchResultReducer';
import searchResults from './searchResultsReducer';
import suggest from './suggestReducer';
import updateAuthToken from './updateAuthTokenReducer';

const rootReducer = history => combineReducers({
  router: connectRouter(history),

  appConfig,
  authTokens,

  createAuthToken,
  deleteAuthToken,

  fileUploadStatus,

  saveAppConfig,
  saveSearchResult,
  searchResults,
  suggest,

  updateAuthToken,
});

export default rootReducer;
