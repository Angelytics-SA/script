(() => { // Start of code | to be inserted before other analytics but after the angelitics script

  // List of elements to check.
  const ELEMENTS = [
    HTMLFormElement,
    HTMLInputElement,
    HTMLTextAreaElement,
    HTMLIFrameElement
  ],

    DOC = document,

    // Get current script parameters.
    scs = DOC.getElementsByTagName && DOC.getElementsByTagName('script'),
    sc = scs[scs.length - 1],

    // Angelytics account id.
    // Should be passed in the angelitics server call url.
    A = sc && (
      sc.getAttribute('userkey')
      || sc.getAttribute('user-key')
      || sc.getAttribute('data-user-key')
      || sc.getAttribute('userid')
      || sc.getAttribute('user-id')
      || sc.getAttribute('data-user-id')
      || sc.getAttribute('user')
      || sc.getAttribute('data-user')
      || sc.getAttribute('account')
      || sc.getAttribute('data-account')
      || sc.getAttribute('accountid')
      || sc.getAttribute('account-id')
      || sc.getAttribute('data-account-id')
    ),

    // Function to return a descriptor that prevents property / attribute / method override.
    getRestrictedOverrideDescriptor = (d, o = { configurable: false },) => {
      d.enumerable && (o.enumerable = true);
      d.get && (o.get = d.get);
      d.set && (o.set = d.set);
      d.get || d.set || ((o.value = d.value), o.writable = false);
      return o;
    },

    // Function to protect object property / attribute / method.
    protectObjectProperty = (o, k, d) => (
      (typeof (d = Object.getOwnPropertyDescriptor(o || {}, k) || {}).value === 'function' || d.get || d.set)
      && d.configurable
      && Object.defineProperty(o, k, getRestrictedOverrideDescriptor(d))
    ),

    getUrlParams = (
      url,
      aKey = 'angelytics-account-id',
      _extra = A && `${url.search && '&' || '?'}${aKey}=${A}` || ''
    ) => (url.search || '') + _extra + (url.hash || ''),

    // Modify url if needed
    getUrl = (
      url,
      gaUrl = 'https://www.google-analytics.com/g/collect',
      mpUrl = 'https://www.facebook.com/tr/',
      _url = new URL(url, window.location),
      __url = _url.origin + _url.pathname
    ) => __url === gaUrl && new URL('https://api.angelytics.ai/g-event' + getUrlParams(_url))
      || __url === mpUrl && new URL('https://api.angelytics.ai/fb-event' + getUrlParams(_url))
      || _url,

    // Save the original functions.
    originalOpen = XMLHttpRequest.prototype.open,
    originalFetch = function(o) {
      try {
        o || (o = fetch);
      } catch {
        o = () => { };
      }
      return o;
    }(window.fetch),
    originalCreateElement = document.createElement,
    originalImageSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src'),
    originalSendBeacon = navigator.sendBeacon;

  // Prevent override.
  // for (let i = 0, l = ELEMENTS.length, o, k, n, j, m; i !== l; ++i) {
  //   o = ELEMENTS[i];
  //   for (k in o) protectObjectProperty(o, k);
  //   for (j = 0, m = (n = Object.getOwnPropertyNames(o = Object.seal(o).prototype || {})).length; j !== m; ++j)
  //     protectObjectProperty(o, n[j]);
  //   Object.seal(o);
  // }

  // Prevent just tge override of Form.submit
  protectObjectProperty(HTMLFormElement.prototype ,'submit');

  // Override fetch
  Object.defineProperty(window, 'fetch', {
    value: async function (url, ...other) {
      return await originalFetch(getUrl(url).toString(), ...other);
    },
    // configuarble: false,
    // writable: false
  });

  // Override XMLHttpRequest.prototype.open
  Object.defineProperty(XMLHttpRequest.prototype, 'open', {
    value: function (method, url, ...other) {
      return originalOpen.apply(this, [method, getUrl(url).toString(), ...other]);
    },
    // configuarble: false,
    // writable: false
  });

  // Override JSONP
  document.createElement = function (...args) {
    const element = originalCreateElement.apply(this, args);
    args[0] === "script" && Object.defineProperty(element, 'src', {
      get: function () {
        return this.getAttribute('src');
      },
      set: function (url) {
        this.setAttribute('src', url = getUrl(url).toString());
        return url;
      },
      // configuarble: false,
    });
    
    return element;
  };

  // Override image beacon
  Object.defineProperty(HTMLImageElement.prototype, 'src', {
    // configuarble: false,
    get: originalImageSrcDescriptor.get,
    set: function (url) {
      originalImageSrcDescriptor.set.call(this, (url = getUrl(url)).toString());
      return url;
    }
  });

  // Override navigator.sendBeacon
  navigator.sendBeacon = function (url, data) {
    return originalSendBeacon.call(navigator, getUrl(url).toString(), data);
  };

  // Remove script node from dom.
  sc.remove();

})(); // End of code