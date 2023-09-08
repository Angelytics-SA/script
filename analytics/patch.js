const { WIN, DOC, NAV, LOC, A, TP, OA } = require('./globals');
const EP = (() => {
  let v, o = '', k,
    _l = LOC && new URL(LOC),
    l = _l && encodeURIComponent(_l.origin + _l.pathname) || '';
  l && (o += `&angelytics-current-page-url=${l}`);
  A && (o += `&angelytics-account-id=${A}`);
  for (k in OA) {
    (v = OA[k])
      && (v.length || v.size)
      && (o += Array.from(v).reduce((o, v) => o += `&angelytics-patching-${k}=${v}`, ''));
  }
  return o.slice(1);
})();

// Filter out the last '/'.
const normalizeUrl = (url, l = url.length) => l > 1 && url.charAt(l) === '/' && url.slice(0, l - 1) || url;

// Normalize urls to patch.
const normalizeUrlMap = map => new Map(
  Array.from(map || []).map(
    ([k, v]) => [normalizeUrl(k), normalizeUrl(v)]
  )
);

// Urls to patch.
const TO_PATCH = normalizeUrlMap(TP);

// Get url parameters.
const getUrlParams = url => (
  (url.search || '')
  + (EP && `${url.search && '&' || '?'}${EP}` || '')
  + (url.hash || '')
);

// Get/Modify url if needed.
const getUrl = (
  url,
  toPatch = TO_PATCH,
  _url = new URL(url, LOC),
  __url = normalizeUrl(_url.origin + _url.pathname),
  r = toPatch.get(__url)
) => r && new URL(r + getUrlParams(_url)) || _url;

// Save the original functions.
const originalOpen = XMLHttpRequest.prototype.open,
  originalFetch = function (o) {
    try {
      o || (o = fetch);
    } catch {
      o = () => {};
    }
    return o;
  }(WIN.fetch),
  originalCreateElement = DOC.createElement,
  originalImageSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src'),
  originalSendBeacon = NAV.sendBeacon;

// Patch.
module.exports = toPatch => {
  toPatch
    && (toPatch = normalizeUrlMap(toPatch))
    || (toPatch = TO_PATCH);

  // Override fetch
  Object.defineProperty(WIN, 'fetch', {
    value: async function (url, ...other) {
      return await originalFetch(getUrl(url, toPatch).toString(), ...other);
    }
  });

  // Override XMLHttpRequest.prototype.open
  Object.defineProperty(XMLHttpRequest.prototype, 'open', {
    value: function (method, url, ...other) {
      return originalOpen.apply(this, [method, getUrl(url, toPatch).toString(), ...other]);
    }
  });

  // Override JSONP
  DOC.createElement = function (...args) {
    const element = originalCreateElement.apply(this, args);
    args[0] === 'script' && Object.defineProperty(element, 'src', {
      get: function () {
        return this.getAttribute('src');
      },
      set: function (url) {
        this.setAttribute('src', url = getUrl(url, toPatch).toString());
        return url;
      }
    });

    return element;
  };

  // Override image beacon
  Object.defineProperty(HTMLImageElement.prototype, 'src', {
    get: originalImageSrcDescriptor.get,
    set: function (url) {
      originalImageSrcDescriptor.set.call(this, (url = getUrl(url, toPatch)).toString());
      return url;
    }
  });

  // Override navigator.sendBeacon
  NAV.sendBeacon = function (url, data) {
    return originalSendBeacon.call(NAV, getUrl(url, toPatch).toString(), data);
  };
}