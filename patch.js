(() => { // Start of code | to be inserted before other analytics but after the angelitics script

  // Get document and cookies.
  const D = document,
  W = window,
  CRe1 = /\s+;\s+|;\s+|\s+;|;/g,
  CRe2 = /\s+=\s+|\s+=|=\s+|=/,
  gC = (s = D.cookie) => (s || '').split(CRe1).map(s => (s || '').split(CRe2)),
  C = gC(), // we got the cookies.

  // Get current script parameters.
  scs = D.getElementsByTagName && D.getElementsByTagName('script'),
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

  // Disable cookie flag is there.
  dC = sc && (
    sc.hasAttribute('prevent-cookie-tracking')
    || sc.hasAttribute('preventCookieTracking')
    || sc.hasAttribute('prevent-cookies-tracking')
    || sc.hasAttribute('preventCookiesTracking')
  ),
  
  gUP = (
    url,
    aKey = 'angelytics-account-id',
    _extra = A && `${url.search && '&' || '?'}${aKey}=${A}` || ''
  ) => (url.search || '') + _extra + (url.hash || ''),

  // Modify url if needed
  gU = (
    url,
    gaUrl = 'https://www.google-analytics.com/g/collect',
    mpUrl = 'https://www.facebook.com/tr/',
    _url = new URL(url, W.location),
    __url = _url.origin + _url.pathname
  ) => __url === gaUrl && new URL('https://api.angelytics.ai/g-event' + gUP(_url))
    || __url === mpUrl && new URL('https://api.angelytics.ai/fb-event' + gUP(_url))
    || _url,

  // Save the original functions.
  oO = XMLHttpRequest.prototype.open,
  oF = function (o) {
    try {
      o || (o = fetch);
    } catch {
      o = () => { };
    }
    return o;
  }(W.fetch),
  oCE = document.createElement,
  oISD = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src'),
  oSB = navigator.sendBeacon;

  // Override fetch
  Object.defineProperty(W, 'fetch', {
    value: async function (url, ...other) {
      return await oF(gU(url).toString(), ...other);
    }
  });

  // Override XMLHttpRequest.prototype.open
  Object.defineProperty(XMLHttpRequest.prototype, 'open', {
    value: function (method, url, ...other) {
      return oO.apply(this, [method, gU(url).toString(), ...other]);
    }
  });

  // Override JSONP
  document.createElement = function (...args) {
    const element = oCE.apply(this, args);
    args[0] === "script" && Object.defineProperty(element, 'src', {
      get: function () {
        return this.getAttribute('src');
      },
      set: function (url) {
        this.setAttribute('src', url = gU(url).toString());
        return url;
      }
    });

    return element;
  };

  // Override image beacon
  Object.defineProperty(HTMLImageElement.prototype, 'src', {
    // configuarble: false,
    get: oISD.get,
    set: function (url) {
      oISD.set.call(this, (url = gU(url)).toString());
      return url;
    }
  });

  // Override navigator.sendBeacon
  navigator.sendBeacon = function (url, data) {
    return oSB.call(navigator, gU(url).toString(), data);
  };

  // If disable cookie flag is there.
  if (dC) {
    // Regular expressions for filtering client side
    const vRe = [
      // email checker
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i,
      // ip v4 checker
      /^(?!.*\.$)((?!0\d)(1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/,
      // ip v6 checker
      /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/gi,
      // mac address
      /\b([0-9A-F]{2}[:-]){5}([0-9A-F]){2}\b/i,
      // phone number
      /^(\+[0-9]{1,4}(\s[\.\-]\s|[\.\-]|\s|)|)(\((\s|)|)([0-9]{10}|[0-9]{5}(\s\)|\)|)(\s[\.\-]\s|[\.\-]|\s)[0-9]{5}|[0-9]{3}(\s\)|\)|)(\s[\.\-]\s|[\.\-]|\s)[0-9]{3}(\s[\.\-]\s|[\.\-]|\s)[0-9]{4}|[0-9]{2}(\s\)|\)|)(\s[\.\-]\s|[\.\-]|\s)[0-9]{2}(\s[\.\-]\s|[\.\-]|\s)[0-9]{2}(\s[\.\-]\s|[\.\-]|\s)[0-9]{2}(\s[\.\-]\s|[\.\-]|\s)[0-9]{2})$/,
      // social security number
      /^([0-9]{3}\s[0-9]{2}\s[0-9]{4}|[0-9]{3}\-[0-9]{2}\-[0-9]{4}|[0-9]{3}\.[0-9]{2}\.[0-9]{4})$/
    ],
    kRe = [
      /(_|)ga|(_|)utm[a-z]/i,
      /(_|)fbp/i,
      /(_|)(g|)id/i,
    ],
    _isS = (s, re) => {
      if (!s) return false;
      s = s.toString();
      Array.isArray(re) || (re = [re]);
      for (let i = 0, l = re.length; i !== l; ++i) {
        if (re[i].test(s)) return true;
      }
      return false;
    },
    isS = (k, v) => _isS(k, kRe) || _isS(v, vRe),
    Cd = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
      Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
    
    // Filter cookies that contains sensitive data.
    for (let i = 0, l = C.length; i !== l; ++i) {
      const [k, v] = C[i] || [];
      isS(k, v) && (D.cookie = `${k}=; expires=${new Date(Date.now() - 120000).toUTCString()}; max-age=-99999999`);
    }

    // Prevent the creation of new sensitive cookies.
    if (Cd && Cd.configurable) {
      Object.defineProperty(D, 'cookie', {
        get: function () {
          return Cd.get.call(D);
        },
        set: function (val) {
          let c = gC(val), s = false, i = 0, l = c.length;
          for (; i !== l && !s; ++i) s = isS(...c[i]);
          s || Cd.set.call(D, val);
          return val;
        }
      });
    }
  }

  // Remove script node from dom.
  sc.remove();
})(); // End of code