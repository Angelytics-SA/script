// Global client variables.
const Globals = {
  TAGS: Object.freeze({
    dev: 'dev.',
    sales: 'sales',
    design: 'design',
    management: 'mgmt',
    execs: 'execs'
  })
}

try {
  // Browser window.
  const WIN = Globals.WIN = window;

  // Browser navigator.
  const NAV = Globals.NAV = WIN.navigator || navigator;

  // Browser document.
  const DOC = Globals.DOC = WIN.document || document;

  // User agent.
  const UA = Globals.UA = NAV.userAgent || '';

  // Current page url.
  Globals.LOC = (WIN.location || location || {}).href;

  // Storage.
  const STO = Globals.STO = WIN.sessionStorage || sessionStorage;
  const STO_PRE = Globals.STO_PRE = 'aglx';

  // Additional storage variables.
  Globals.STO_GE= `${STO_PRE}-good-exit`;
  Globals.STO_TBC = `${STO_PRE}-time-before-crash`;
  Globals.STO_WN = `${STO_PRE}-window-name`;

  // Current script.
  const scs = DOC.getElementsByTagName && DOC.getElementsByTagName('script'),
    SC = Globals.SC = scs[scs.length - 1];

  // Encryption key.
  Globals.EK = SC && (
    SC.getAttribute('apikey')
    || SC.getAttribute('key')
    || SC.getAttribute('publickey')
    || SC.getAttribute('api-key')
    || SC.getAttribute('public-key')
    || SC.getAttribute('data-api-key')
    || SC.getAttribute('data-key')
    || SC.getAttribute('data-public-key')
  ) || undefined;

  // Account id.
  Globals.A = SC && (
    SC.getAttribute('userkey')
    || SC.getAttribute('user-key')
    || SC.getAttribute('data-user-key')
    || SC.getAttribute('userid')
    || SC.getAttribute('user-id')
    || SC.getAttribute('data-user-id')
    || SC.getAttribute('user')
    || SC.getAttribute('data-user')
    || SC.getAttribute('account')
    || SC.getAttribute('data-account')
    || SC.getAttribute('accountid')
    || SC.getAttribute('account-id')
    || SC.getAttribute('data-account-id')
  ) || undefined;

  // Disable cookie flag.
  Globals.DC = SC && (
    SC.hasAttribute('disable-cookie')
    || SC.hasAttribute('disableCookie')
    || SC.hasAttribute('disable-cookies')
    || SC.hasAttribute('disableCookies')
  );

  // Namespace to operate in.
  Globals.NS = SC && SC.getAttribute('namespace') || 'angelytics';

  // Provided callback for analytics.
  Globals.CB = SC && (
    SC.getAttribute('callback')
    || SC.getAttribute('cb')
    || SC.getAttribute('data-callback')
    || SC.getAttribute('data-cb')
  ) || null;

  // Mobile system.
  const IS_ANDROID_MOB = /Android|Opera Mini/.test(UA) || WIN.Android || false,
    IS_WINS_MOB = /Windows Phone|IEMobile/.test(UA),
    IS_OTHER_MOB = /webOS|BlackBerry/.test(UA),
    IS_IOS_MOB = /iP(hone|ad|od)/.test(UA)
      && WIN.webkit
      && !(IS_ANDROID_MOB || IS_WINS_MOB || IS_OTHER_MOB);
  const MOB = Globals.MOB = (IS_IOS_MOB && 'ios')
    || (IS_ANDROID_MOB && 'android')
    || (IS_WINS_MOB && 'windows')
    || (IS_OTHER_MOB && 'other')
    || '';

  // Check if it has a touch screen.
  let MQ;
  Globals.TS = !!(
    MOB
    || NAV.maxTouchPoints > 0
    || NAV.msMaxTouchPoints > 0
    || (
      (MQ = ((WIN.matchMedia || (() => { }))('(pointer:coarse)') || {}))
      && MQ.media === '(pointer:coarse)'
      && MQ.matches
    ) || WIN.orientation
  );

  // Browser.
  const VENDOR = NAV.vendor || '',
    IS_APPLE = /Apple/.test(VENDOR) || /Mac/.test(UA),
    IS_SAFARI = IS_APPLE && /Safari/.test(UA),
    IS_GOOGLE = /Google/.test(VENDOR) || !IS_APPLE,
    IS_CHROMIUM = /Chromium/.test(UA) && IS_GOOGLE,
    IS_CHROME = ((/Chrome/.test(UA) && IS_GOOGLE) || (WIN.chrome && (WIN.chrome.webstore || WIN.chrome.runtime))) && !IS_CHROMIUM,
    IS_SEAMONKEY = /Seamonkey/.test(UA),
    IS_FIREFOX = (/Firefox/.test(UA) || typeof InstallTrigger !== 'undefined') && !IS_SEAMONKEY,
    IS_OPERA = /OPR|Opera/.test(UA),
    IS_IE = /MSIE|Trident.*rv\:11\./.test(UA) || /*@cc_on!@*/false || !!DOC.documentMode;
  Globals.BRO = (IS_SAFARI && 'safari')
    || (IS_CHROME && 'chrome')
    || (IS_CHROMIUM && 'chromium')
    || (IS_SEAMONKEY && 'seamonkey')
    || (IS_FIREFOX && 'firefox')
    || (IS_OPERA && 'opera')
    || (IS_IE && 'ie');

  // Rendering engine.
  const IS_GECKO = /Mobile|Tablet/.test(UA) && /Gecko|Firefox/.test(UA) && /Mozilla/.test(UA) || IS_FIREFOX,
    IS_EDGE = (!IS_IE && !!WIN.StyleMedia) || (IS_CHROME && /Edg/.test(UA)),
    IS_BLINK = (IS_CHROME || IS_OPERA) && !!WIN.CSS,
    IS_WEBKIT = /KHTML/.test(UA) && /AppleWebKit/.test(UA);
  Globals.REN = (IS_EDGE && 'edge')
    || (IS_BLINK && 'blink')
    || (IS_GECKO && 'gecko')
    || (IS_WEBKIT && 'webkit');

  // Device size.
  const WIDTH = WIN.innerWidth || WIN.documentElement.clientWidth;
  Globals.WST = MOB && (
    (WIDTH < 480 && 'phone')
    || (WIDTH > 1152 && 'large-tablet')
    || (WIDTH && 'tablet')
  ) || 'desktop';

  // Timezone.
  const TZO = Globals.TZO = Math.round((new Date).getTimezoneOffset() / 60);

  // Session id.
  const SN = `${STO_PRE}-session-id`;
  Globals.SID = STO && function (id = STO.getItem(SN) || '') {
    if (id) return id;
    let t = performance && performance.now() || Date.now(),
      f = (y, x = y & 63) => String.fromCharCode(x < 10 && (x + 48) || (x < 36 && (x + 55)) || (x < 62 && (x + 61)) || 95),
      v = 10 + ((Math.random() * 52) << 0),
      i = 6;
    id += f(v & 63);
    while (i--) {
      id += f(v = (t + Math.random() * 1e17));
      id += f(v = v >> 6);
      id += f(v = v >> 6);
      id += f(v = v >> 6);
      id += f(v = v >> 6);
    }

    STO.setItem(SN, id += f(25 + TZO));
    return id;
  }();

  // Analytics Endpoint.
  Globals.EP = 'https://api.angelytics.ai/event';

  // Unique prefix id.
  Globals.PRE_ID = 'angelytics-unique';
  Globals.IDK = '__angelytics_unique_id__'
  
  Globals.CLIENT = true;
} catch {
  Globals.SERVER = true;
};

// Exports.
module.exports = Object.freeze(Globals);