import { defaultSearchEngineUrl, windowTitle } from '../constants/appConfig';

export function suppressEvent(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
}

export function setDocumentTitle(query) {
  if (query && query.length) {
    document.title = `${query} - ${windowTitle}`;
  } else {
    document.title = windowTitle;
  }
}

export function setStateFromEvent(componentInstance, fieldName, event) {
  componentInstance.setState({
    [fieldName]: event.target.value,
  });
}

export function setStateFromValue(componentInstance, fieldName, value) {
  componentInstance.setState({
    [fieldName]: value,
  });
}

export function isLokiExtensionActive() {
  const appTag = document.querySelector('div#app');
  return appTag.classList.contains('loki-extension-active');
}

export const isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
  },
  any: function () {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  },
};

export function colorLuminance(hex, lum) {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  let rgb = "#", c, i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }

  return rgb;
}

export function getSearchUrl(appConfig, query) {
  const searchEngineUrl = (appConfig.loaded && appConfig.data.search && appConfig.data.search.defaultSearchEngineUrl) ?
    appConfig.data.search.defaultSearchEngineUrl : defaultSearchEngineUrl;

  return searchEngineUrl.replace('%s', encodeURIComponent(query));
}
