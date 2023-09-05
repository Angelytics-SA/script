(() => { // Start of code | to be inserted before other analytics but after the angelitics script

  // Get document and cookies.
  const D = document,
    W = window,
    L = (W.location || location || {}).href || '';
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

    // Disable cookie flag.
    dC = sc && (
      sc.hasAttribute('disable-cookie')
      || sc.hasAttribute('disableCookie')
      || sc.hasAttribute('disable-cookies')
      || sc.hasAttribute('disableCookies')
    ),

    // Filter out the last '/'.
    fU = (url, l = url.length) => l > 1 && url.charAt(l) === '/' && url.slice(0, l - 1) || url,

    // A list of urls to re-orient to angelytics endpoints.
    U = new Map([
      ['https://www.google-analytics.com/g/collect', 'https://api.angelytics.ai/g-event'],
      ['https://www.facebook.com/tr', 'https://api.angelytics.ai/fb-event'],
    ].map(([k, v]) => [fU(k), fU(v)])),

    // Get url parameters.
    gUP = (
      url,
      aKey = 'angelytics-account-id',
      lKey = 'angelytics-current-page-url',
      _l = L && new URL(L),
      l = _l && encodeURIComponent(_l.origin + _l.pathname) || '',
      p = `${url.search && '&' || '?'}${lKey}=${l}` +
        (A && `&${aKey}=${A}` || '')
    ) => (url.search || '') + p + (url.hash || ''),

    // Modify url if needed.
    gU = (
      url,
      _url = new URL(url, L),
      __url = fU(_url.origin + _url.pathname),
      r = U.get(__url)
    ) => r && new URL(r + gUP(_url)) || _url,

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
    const Cd = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
      Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');

    // Disable cookies.
    for (let i = 0, l = C.length; i !== l; ++i) {
      const [k, _] = C[i] || [];
      k && (D.cookie = `${k}=; expires=${new Date(Date.now() - 120000).toUTCString()}; max-age=-99999999`);
    }

    // Prevent the creation of new cookie.
    if (Cd && Cd.configurable) {
      Object.defineProperty(D, 'cookie', {
        get: function () {
          return Cd.get.call(D);
        },
        set: function (val) {
          // Does nothing but returning the value.
          return val;
        }
      });
    }
  }

  // Attribute a unique id to each element.
  // Those elements have to be constructed at rendering time.
  let m = 0, n = D.body, q = [n], t, i, l, c;
  while (n = q.pop()) {
    // Add a unique id if needed.
    !(t = n.tagName)
      || (t = t.toLowerCase()) === 'script'
      || n.id || n.getAttribute('id')
      || (n.id = `angelytics-unique-${t}-id-${++m}`);

    // Add child nodes to the queue.
    for (i = 0, c = n.childNodes || [], l = c.length; i !== l; ++i) q.push(c[i]);
  }

  // Remove script node from dom.
  sc.remove();
})(); // End of code