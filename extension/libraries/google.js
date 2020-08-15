const GOOGLE = {};

GOOGLE.matches = (url) => {
  return url.startsWith('https://') && (
      url.startsWith('https://www.google.com/search') ||
      url.startsWith('https://google.com/search') ||
      url.startsWith('https://google.co.in/search') ||
      url.startsWith('https://www.google.co.in/search') ||
      url.startsWith('https://google.co.uk/search') ||
      url.startsWith('https://www.google.co.uk/search') ||
      url.startsWith('https://google.co.uk/search') ||
      url.startsWith('https://www.google.co.uk/search')
    );
};

GOOGLE.getSearchResults = (url) => {
  browser.tabs.executeScript({
    code: `
function getSearchResults() {
  const searchResults = [];
  const results = document.querySelectorAll('#rso .rc');
  if (!results) {
    console.log('no search results found');
    return;
  }

  for (let i = 0; i < results.length; i++) {
    const resultEl = results[i];
    const urlEl = resultEl.querySelector('.r a');
    const titleEl = resultEl.querySelector('.r h3');
    const descriptionEl = resultEl.querySelector('.s');

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
      source: 'google',
      url,
      searchResults: JSON.stringify(results[0]),
    }, function (res) {
    });
  });
};
