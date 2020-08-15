const DDG = {};

DDG.matches = (url) => {
  return url.startsWith('https://duckduckgo.com');
};

DDG.getVideos = (url) => {
  browser.tabs.executeScript({
    code: `
function getVideos() {
  const videosResult = [];
  const videosList = document.querySelector('div.tileview__videos');
  if (!videosList) {
    console.log('no videos found');
    return;
  }

  const videos = videosList.querySelectorAll('div.tile.tile--vid');

  for (let i = 0; i < videos.length; i++) {
    const vidEl = videos[i];
    const imgEl = vidEl.querySelector('img.tile__media__img');
    const titleEl = vidEl.querySelector('h6.tile__title');
    const viewCountEl = vidEl.querySelector('span.tile__count');
    const sourceEl = vidEl.querySelector('span.video-source');

    const video = {
      url: titleEl ? titleEl.querySelector('a').href : '',
      image: imgEl ? imgEl.src : '',
      title: titleEl ? titleEl.innerText : '',
      viewCount: viewCountEl ? viewCountEl.innerText : '',
      source: sourceEl ? sourceEl.innerText : ','
    };

    videosResult.push(video);
  }
  
  return videosResult;
}

getVideos();
      `
  }, function (results) {
    if (browser.runtime.lastError) {
      console.error('Error in parsing search results from html', browser.runtime.lastError.message);
      return;
    }

    if (!results) {
      console.error('Results is not defined, error in parsing search results from html');
      return;
    }

    ajax.post(`${API_BASE}/data/videos`, {
      source: 'duckduckgo',
      url,
      videos: JSON.stringify(results[0]),
    }, function (res) {
    });
  });
};

DDG.getSearchResults = (url) => {
  browser.tabs.executeScript({
    code: `
function getSearchResults() {
  const searchResults = [];
  const resultsList = document.querySelector('div.results');
  if (!resultsList) {
    console.log('no search results found');
    return;
  }

  const results = resultsList.querySelectorAll('div.result');

  for (let i = 0; i < results.length; i++) {
    const resultEl = results[i];
    const titleEl = resultEl.querySelector('h2.result__title');
    const urlEl = resultEl.querySelector('a.result__url');
    const descriptionEl = resultEl.querySelector('div.result__snippet');

    const video = {
      url: urlEl ? urlEl.href : '',
      title: titleEl ? titleEl.innerText : '',
      description: descriptionEl ? descriptionEl.innerText : ','
    };

    searchResults.push(video);
  }
  
  return searchResults;
}

getSearchResults();
      `
  }, function (results) {
    if (browser.runtime.lastError) {
      console.error('Error in parsing search results from html', browser.runtime.lastError.message);
      return;
    }

    if (!results) {
      console.error('Results is not defined, error in parsing search results from html');
      return;
    }

    ajax.post(`${API_BASE}/data/search_results`, {
      source: 'duckduckgo',
      url,
      searchResults: JSON.stringify(results[0]),
    }, function(res) {
    });
  });
};
