export default {
  appConfig: {
    loading: false,
    loaded: false,
    error: null,

    data: {},

    canEdit: false,
    isPubliclyEditable: false,
  },

  saveAppConfig: {
    saving: false,
    saved: false,
    error: null,
  },

  searchResults: {
    query: {
      loading: false,
      loaded: false,
      error: null,

      result: null,
      webPages: {},
    },
  },

  saveSearchResult: {
    query: {
      saving: false,
      saved: false,
      error: null,
    },
  },

  searchSuggestions: {
    query: {
      suggestions: [],
      links: {},
      query: '',
      loading: false,
      loaded: false,
      error: null,
    },
  },

  fileUploadStatus: {
    uploading: false,
    uploaded: false,
    error: false,

    file: {},
  },

  authTokens: {
    loading: false,
    loaded: false,
    error: null,

    ids: [],
    map: {},
  },

  createAuthToken: {
    saving: false,
    saved: false,
    error: null,
  },

  updateAuthToken: {
    tokenId: {
      saving: false,
      saved: false,
      error: null,
    },
  },

  deleteAuthToken: {
    tokenId: {
      saving: false,
      saved: false,
      error: null,
    },
  },
};
