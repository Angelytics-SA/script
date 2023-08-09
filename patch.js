(() => { // Start of code | to be inserted before other analytics but after the angelitics script

  // List of elements to check.
  const ELEMENTS = [
    HTMLFormElement,
    HTMLInputElement,
    HTMLTextAreaElement,
    HTMLIFrameElement
  ],

    DOC = document,

    cookies = (DOC.cookie || '').split(/;s+|;/g).map(s => (s || '').split(/s+=s+|s+=|=\s+|=/)),

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
      // mpUrl = 'https://www.example.com',
      _url = new URL(url, window.location),
      __url = _url.origin + _url.pathname
    ) => __url === gaUrl && new URL('https://api.angelytics.ai/g-event' + getUrlParams(_url))
    || __url === mpUrl && new URL('https://api.angelytics.ai/fb-event' + getUrlParams(_url))
      || _url,

    // Save the original functions.
    originalOpen = XMLHttpRequest.prototype.open,
    originalFetch = function (o) {
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
  protectObjectProperty(HTMLFormElement.prototype, 'submit');

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

  // To test email, ip addresses, mac addresses, etc.
  const emailRe = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    ipv4Re = /^(?!.*\.$)((?!0\d)(1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/,
    ipv6Re = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/gi,
    macRe = /\b([0-9A-F]{2}[:-]){5}([0-9A-F]){2}\b/i,
    isSensitive = s => s && (
       emailRe.test(s)
       || ipv4Re.test(s)
       || ipv6Re.test(s)
       || macRe.test(s)
    );
  
  // Filter cookies that contains sensitive data.
  for (let i = 0, l = cookies.length; i !== l; ++i) {
    const [k, v] = cookies[i] || [];
    isSensitive(v) && (DOC.cookie = `${k}=; expires=${new Date(Date.now() - 120000).toUTCString()}; max-age=-99999999`);
  }

  // Remove script node from dom.
  sc.remove();

})(); // End of code