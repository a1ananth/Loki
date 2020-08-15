browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    const { url } = tab;

    if (DDG.matches(url)) {
      setTimeout(() => {
        try {
          DDG.getSearchResults(url);
        } catch (err) {
          console.error('Failed to retrieve search results from DDG results page', err);
        }

        try {
          DDG.getVideos(url);
        } catch (err) {
          console.error('Failed to retrieve videos from DDG results page', err);
        }
      }, 1000);
    } else if (GOOGLE.matches(url)) {
      setTimeout(() => {
        try {
          GOOGLE.getSearchResults(url);
        } catch (err) {
          console.error('Failed to retrieve search results from Google results page', err);
        }
      }, 1000);
    } else if (YOUTUBE.matches(url)) {
      setTimeout(() => {
        try {
          YOUTUBE.getMainVideoDetails(url);
        } catch (err) {
          console.error('Failed to retrieve main video details from Youtube video page', err);
        }

        try {
          YOUTUBE.getSuggestionVideos(url);
        } catch (err) {
          console.error('Failed to retrieve suggestion videos from Youtube video page', err);
        }
      }, 1000);
    }
  }
});
