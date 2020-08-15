const ajax = {};
ajax.x = function () {
  if (typeof XMLHttpRequest !== 'undefined') {
    return new XMLHttpRequest();
  }
  const versions = [
    "MSXML2.XmlHttp.6.0",
    "MSXML2.XmlHttp.5.0",
    "MSXML2.XmlHttp.4.0",
    "MSXML2.XmlHttp.3.0",
    "MSXML2.XmlHttp.2.0",
    "Microsoft.XmlHttp"
  ];

  let xhr;
  for (let i = 0; i < versions.length; i++) {
    try {
      xhr = new ActiveXObject(versions[i]);
      break;
    } catch (e) {
    }
  }
  return xhr;
};

ajax.send = function (url, callback, method, data, async) {
  if (async === undefined) {
    async = true;
  }
  const x = ajax.x();
  x.open(method, url, async);
  x.onreadystatechange = function () {
    if (x.readyState === 4) {
      callback(x.responseText)
    }
  };
  if (method === 'POST') {
    x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  }
  x.send(data)
};

ajax.get = function (url, data, callback, async) {
  const query = [];
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
  }
  ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
};

ajax.post = function (url, data, callback, async) {
  const query = [];
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
  }

  ajax.send(url, callback, 'POST', query.join('&'), async)
};
