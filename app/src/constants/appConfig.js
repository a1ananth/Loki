export let env = process.env.REACT_APP_HOST_ENV || process.env.NODE_ENV;
export let apiBaseUrl = '';

export const randomColors = [
  "#287E45",
  "#D22B39",
  "#396AC3",
  "#B7845A",
  "#E983B4",
  "#26D04D",
  "#E0CF8B",
  "#C11288",
  "#0AD4CC",
  "#B6E92E",
  "#AE3896",
  "#FB154A"
];

if (!env) {
  env = 'development';
}

// TODO Get App Name from server config

export const appName = 'Loki';
export let siteName = appName;
export let windowTitle = `${siteName} Search`;

export function setSiteName(newName) {
  siteName = newName;
  windowTitle = `${siteName} Search`;
}

export const appVersion = 'v0.1.4';

export const defaultTagline = 'You may not be able to remember all the important information you read on the web. Loki does it for you.';
export const defaultBackgroundColor = '#e7edff';
export const defaultSearchEngineUrl = 'https://duckduckgo.com/?q=%s';

export const githubProjectLink = 'https://github.com/a1ananth/loki';
