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
    );

  // Prevent override.
  for (let i = 0, l = ELEMENTS.length, o, k, n, j, m; i !== l; ++i) {
    o = ELEMENTS[i];
    for (k in o) protectObjectProperty(o, k);
    for (j = 0, m = (n = Object.getOwnPropertyNames(o = Object.seal(o).prototype || {})).length; j !== m; ++j)
      protectObjectProperty(o, n[j]);
    Object.seal(o);
  }

  // Get current fetch and XMLHttpRequest.prototype.open methods
  let oldFetch = window.fetch, oldOpen = XMLHttpRequest.prototype.open;
  try {
    oldFetch || (oldFetch = fetch);
  } catch {
    oldFetch = () => { };
  }

  // Override fetch
  Object.defineProperty(window, 'fetch', {
    value: async function (url, ...other) {
      let GAURL = 'https://www.google-analytics.com';
      let MPURL = 'https://www.facebook.com/tr/';

      url = new URL(url);
      let baseurl = url.origin + url.pathname;

      if (baseurl === GAURL) {
        url = new URL('https://api.angelytics.com/g-event');
      } else if (baseurl === MPURL) {
        url = new URL('https://api.angelytics.com/f-event');
      }

      return await oldFetch(url.toString(), ...other);
    },
    configuarble: false,
    writable: false
  });

  // Override XMLHttpRequest.prototype.open
  Object.defineProperty(XMLHttpRequest.prototype, 'open', {
    value: function (method, url, ...other) {
      let GAURL = 'https://www.google-analytics.com';
      let MPURL = 'https://www.facebook.com/tr/';

      url = new URL(url);
      let baseurl = url.origin + url.pathname;

      if (baseurl === GAURL) {
        url = new URL('https://api.angelytics.com/g-event');
      } else if (baseurl === MPURL) {
        url = new URL('https://api.angelytics.com/f-event');
      }


      return oldOpen.apply(this, [method, url.toString(), ...other]);
    },
    configuarble: false,
    writable: false
  });

  // Remove script node from dom.
  sc.remove();

})(); // End of code