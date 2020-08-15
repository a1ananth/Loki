const YOUTUBE = {};

YOUTUBE.matches = (url) => {
  return url.startsWith('https://www.youtube.com') || url.startsWith('https://youtube.com');
};

YOUTUBE.getMainVideoDetails = (url) => {
  browser.tabs.executeScript({
    code: `
function getMainVideo() {
  const videosResult = [];
  const titleEl = document.querySelector('h1.title');
  
  if (!titleEl) {
    return [];
  }

  const videoId = new URLSearchParams(window.location.search).get('v');
  const viewCountEl = document.querySelector('span.view-count').innerText;

  const video = {
    url: window.location.href,
    image: 'https://img.youtube.com/vi/' + videoId + '/default.jpg',
    title: titleEl ? titleEl.innerText : '',
    viewCount: viewCountEl ? viewCountEl.innerText : '',
    source: 'youtube'
  };

  videosResult.push(video);
  
  return videosResult;
}

getMainVideo();
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
      source: 'youtube',
      url,
      videos: JSON.stringify(results[0]),
    }, function (res) {
    });
  });
};

YOUTUBE.getSuggestionVideos = (url) => {
  browser.tabs.executeScript({
    code: `
function getVideos() {
  const videosResult = [];
  
  const videos = videosList.querySelectorAll('ytd-compact-video-renderer');
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
      source: 'youtube',
      url,
      videos: JSON.stringify(results[0]),
    }, function (res) {
    });
  });
};