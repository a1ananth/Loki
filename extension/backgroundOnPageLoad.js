//let url = window.location.toString();

// console.log('got url', url);
//if (url.startsWith('https://duckduckgo.com')) {
   //console.log('Need to crawl this page');
//}
 //document.body.style.background = '#EFEFEF';

(() => {
  const lokiAppTag = document.querySelector('div#app.loki-web-app');

  if (lokiAppTag) {
    // This is a loki web app
    lokiAppTag.classList.add('loki-extension-active');
  }
})();
