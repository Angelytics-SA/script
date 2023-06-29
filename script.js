/**
* Copyright (c) 2023-present, Crossroad, Inc. All rights reserved.
*
* You are hereby granted a non-exclusive, worldwide, royalty-free license to use,
* copy, modify, and distribute this software in source code or binary form for use
* in connection with the web services and APIs provided by Crossroad.
*
* As with any software that integrates with the Crossroad platform, your use of
* this software is subject to the Crossroad Platform Policy
* [TBD]. This copyright notice shall be
* included in all copies or substantial portions of the software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
* FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
* COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
* IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
* CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(() => {
  // Get browser objects.
  let WINDOW, NAVIGATOR, DOCUMENT, MQ, MOBILE, IS_APPLE, STORAGE, LOCATION, TIMEZONE_OFFSET = Math.round((new Date).getTimezoneOffset() / 60);
  try {
    WINDOW = window;
    NAVIGATOR = WINDOW.navigator || navigator;
    DOCUMENT = WINDOW.document || document;
    LOCATION = WINDOW.location || location;
  } catch { };

  // We need the basics to make the code work.
  if (WINDOW && NAVIGATOR && DOCUMENT) {

    // Get storage.
    try {
      STORAGE = sessionStorage;
    } catch { }

    // Prefix storage variables.
    const PREFIX = 'aglx',

      // Get current script parameters.
      scripts = DOCUMENT.getElementsByTagName && DOCUMENT.getElementsByTagName('script'),
      script = scripts[scripts.length - 1],
      KEY = script && (
        script.getAttribute('apikey')
        || script.getAttribute('key')
        || script.getAttribute('userkey')
        || script.getAttribute('api-key')
        || script.getAttribute('public-key')
        || script.getAttribute('user-key')
        || script.getAttribute('data-api-key')
        || script.getAttribute('data-key')
        || script.getAttribute('data-user-key')
        || script.getAttribute('data-public-key')
      ),
      NAMESPACE = script.getAttribute('namespace') || 'angelitics',
      CB = script.getAttribute('callback')
        || script.getAttribute('cb')
        || script.getAttribute('data-callback')
        || script.getAttribute('data-cb'),

      // Get system parameters.
      // MOBILE: ios | android | windows | other | false
      // BROWSER: chrome | chromium | seamonkey | firefox | opera | ie | false
      // RENDERING_ENGINE: blink | gecko | webkit | false
      // DEVICE_TYPE: phone | tablet | large-tablet | desktop
      // IS_APPLE: true | false
      // HAS_TOUCH_SCREEN: true | false
      VENDOR = NAVIGATOR.vendor || '',
      USER_AGENT = NAVIGATOR.userAgent || '',
      IS_ANDROID_MOBILE = /Android|Opera Mini/.test(USER_AGENT) || WINDOW.Android || false,
      IS_WINDOWS_MOBILE = /Windows Phone|IEMobile/.test(USER_AGENT),
      IS_OTHER_MOBILE = /webOS|BlackBerry/.test(USER_AGENT),
      IS_IOS_MOBILE = /iP(hone|ad|od)/.test(USER_AGENT)
        && WINDOW.webkit
        && !(IS_ANDROID_MOBILE || IS_WINDOWS_MOBILE || IS_OTHER_MOBILE);
    MOBILE = (IS_IOS_MOBILE && 'ios')
      || (IS_ANDROID_MOBILE && 'android')
      || (IS_WINDOWS_MOBILE && 'windows')
      || (IS_OTHER_MOBILE && 'other');
    const HAS_TOUCH_SCREEN = !!MOBILE
      || NAVIGATOR.maxTouchPoints > 0
      || NAVIGATOR.msMaxTouchPoints > 0
      || (
        (MQ = ((WINDOW.matchMedia || (() => { }))('(pointer:coarse)') || {}))
        && MQ.media === '(pointer:coarse)'
        && !!MQ.matches
      ) || !!WINDOW.orientation;
    HAS_TOUCH_SCREEN || (MOBILE = false);

    IS_APPLE = /Apple/.test(VENDOR);
    const IS_SAFARI = /Safari/.test(USER_AGENT) && IS_APPLE;
    IS_APPLE || (IS_APPLE = /Mac/.test(USER_AGENT));
    const IS_GOOGLE = /Google/.test(VENDOR),
      IS_CHROMIUM = /Chromium/.test(USER_AGENT) && IS_GOOGLE,
      IS_CHROME = ((/Chrome/.test(USER_AGENT) && IS_GOOGLE) || (WINDOW.chrome && (WINDOW.chrome.webstore || WINDOW.chrome.runtime))) && !IS_CHROMIUM,
      IS_SEAMONKEY = /Seamonkey/.test(USER_AGENT),
      IS_FIREFOX = (/Firefox/.test(USER_AGENT) || typeof InstallTrigger !== 'undefined') && !IS_SEAMONKEY,
      IS_OPERA = /OPR|Opera/.test(USER_AGENT),
      IS_IE = /MSIE|Trident.*rv\:11\./.test(USER_AGENT) || /*@cc_on!@*/false || !!DOCUMENT.documentMode,
      BROWSER = (IS_SAFARI && 'safari')
        || (IS_CHROME && 'chrome')
        || (IS_CHROMIUM && 'chromium')
        || (IS_SEAMONKEY && 'seamonkey')
        || (IS_FIREFOX && 'firefox')
        || (IS_OPERA && 'opera')
        || (IS_IE && 'ie'),
      IS_GECKO = /Mobile|Tablet/.test(USER_AGENT) && /Gecko|Firefox/.test(USER_AGENT) && /Mozilla/.test(USER_AGENT) || IS_FIREFOX,
      IS_EDGE = (!IS_IE && !!WINDOW.StyleMedia) || (IS_CHROME && /Edg/.test(USER_AGENT)),
      IS_BLINK = (IS_CHROME || IS_OPERA) && !!WINDOW.CSS,
      IS_WEBKIT = /KHTML/.test(USER_AGENT) && /AppleWebKit/.test(USER_AGENT),
      RENDERING_ENGINE = (IS_EDGE && 'edge')
        || (IS_BLINK && 'blink')
        || (IS_GECKO && 'gecko')
        || (IS_WEBKIT && 'webkit'),
      WIDTH = WINDOW.innerWidth || WINDOW.documentElement.clientWidth,
      DEVICE_TYPE = MOBILE && (
        (WIDTH < 480 && 'phone')
        || (WIDTH > 1152 && 'large-tablet')
        || (WIDTH && 'tablet')
      ) || 'desktop',

      // Function to get an element position and rectangle.
      getElementBox = elmt => {
        let x = 0, y = 0, l, t, el = elmt;
        while (el && !isNaN(l = el.offsetLeft) && !isNaN(t = el.offsetTop)) {
          x += l - (el.scrollLeft || 0);
          y += t - (el.scrollTop || 0);
          el = el.offsetParent;
        }
        return {
          x,
          y,
          width: elmt.offsetWidth || 0,
          height: elmt.offsetHeight || 0
        };
      },
      // Function to parse a url.
      parseUrl = url => {
        if (!url || typeof url !== 'string') return null;
        if (URL.canParse && !URL.canParse(url)) return { href: url };
        url = new URL(url);
        const output = {
          href: url.href // Full url
        };
        url.hostname && (output.hostname = url.hostname);
        url.pathname && (output.pathname = url.pathname);
        url.hash && (output.hash = url.hash);
        url.password && (output.password = url.password);
        url.port && (output.port = url.port);
        url.protocal && (output.protocal = url.protocal);
        url.username && (output.username = url.username);
        url.searchParams.size && (output.searchParams = Array.from(Array.from(url.searchParams).reduce((m, [k, v]) => {
          let c = m.get(k);
          c === undefined || Array.isArray(c) || (c = [c]);
          c && (c.push(v));
          m.set(k, c || v);
          return m;
        }, new Map)));
        return output;
      },

      // Helper function to get the metadata.
      getMetadata = elmt => {
        const data = {
          platform: {
            browser: BROWSER,
            renderingEngine: RENDERING_ENGINE,
            deviceType: DEVICE_TYPE,
            isMobile: MOBILE,
            hasTouchScreen: HAS_TOUCH_SCREEN,
            isApple: IS_APPLE,
            language: NAVIGATOR.language
          },
          location: parseUrl(LOCATION.href),
          date: Date.now(),
          timeZoneOffset: TIMEZONE_OFFSET,
          sessionId: SESSION_ID,
          title: DOCUMENT.title
        };
        DOCUMENT.referrer && (data.referrer = parseUrl(DOCUMENT.referrer));

        // Not supported by IE yet.
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          tz && (data.timeZone = tz);
        } catch { };

        if (elmt instanceof Node && typeof elmt.getAttribute === 'function') {
          let el = data.element = getElementBox(elmt), i,
            id = elmt.getAttribute('id') || elmt.id
              || elmt.getAttribute('name') || elmt.name
              || elmt.getAttribute('label') || elmt.label
              || elmt.getAttribute('alt') || elmt.alt
              || ((i = elmt.getAttribute('for') || elmt.for) && `label for ${i}`),
            src = elmt.getAttribute('src') || elmt.src
              || elmt.getAttribute('href') || elmt.href
              || elmt.getAttribute('action') || elmt.action,
            type = elmt.getAttribute('type') || elmt.type;
          id && (el.identifier = id);
          src && (el.source = src);
          el.tagName = elmt.tagName.toLowerCase();
          type && (el.type = elmt.type);
        }
        return data;
      },

      // Utility function to throttle a function call
      // involved in an intensive process.
      // Very useful for exmple with onmousemove and onscroll event.
      throttle = (cb, delay = 50, wait = false, queued = false) => delay > 0 && (
        (...args) => {
          if (wait) {
            queued = true;
            return;
          }

          cb(...args);
          wait = true;
          setTimeout(() => {
            queued && cb(...args);
            queued = wait = false;
          }, delay);
        }
      ) || cb,

      // Function to send data to servers.
      send = CB && typeof WINDOW[CB] === 'function' && ((...data) => WINDOW[CB].apply(WINDOW, data))
        || (KEY && (data => {
          // Send data.
          ///////////////////////////
          // @Tristan to ping the db

          const uri = 'https://api.angelytics.ai/api/event';

          sendPostRequest = () => {
            // @Tristan: remove the console.log for production
            console.log('sending data to server...', data);
            ///////
            return fetch(uri, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data)
            })
              .then(response => response.json())
              .then(result => {
                // Handle the response
                // console.log(result);
                // console.log('Recorded', data);
                return result;
              })
              .catch(error => {
                // Handle the error
                console.error(error);
              });
          }
          sendPostRequest();
        })),
      SESSION_NAME = `${PREFIX}-session-id`,
      SESSION_ID = STORAGE && function (id = STORAGE.getItem(SESSION_NAME) || '') {
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

        STORAGE.setItem(SESSION_NAME, id += f(25 + TIMEZONE_OFFSET));
        return id;
      }();

    WINDOW[NAMESPACE] = {
      // To get metadata.
      getMetadata,
      // Throttle helper function
      throttle
    };

    // Overide code only if we can send the data somewhere.
    if (send) {
      // Function to record the click.
      const record = (eventName, body, elmt, error, type, userId) => {
        // Get the device data.
        const data = getMetadata(elmt);
        type && (data.eventType = type);
        error && (data.error = error);
        eventName && (data.eventName = eventName);
        body && (data.body = body);
        (typeof userId === 'number' || userId) && (data.userId = typeof userId === 'object' && JSON.stringify(userId) || `${userId}`);
        data.apiKey = KEY;

        // Encode data.
        send(data);
        return data;
      },

        // Overide Helper function.
        attrOveride = (
          node,
          prop,
          cb,
          func = (node.getAttribute && node.getAttribute(prop)) || node[prop],
          t = typeof func
        ) => t === 'function' && (
          node[prop] = function (...args) {
            cb();
            return func.apply(node, args);
          }
        ) || (
            t === 'string' && (
              node[prop] = () => {
                cb();
                eval(func);
              }
            )
          ),

        // Overide direct gesture event functions.
        clickAttrOveride = (node, prop) => attrOveride(
          node,
          prop,
          () => record(prop.toLowerCase().slice(2), null, node, null, 'gesture')
        ),

        // Overide scrolling event.
        scrollAttrOveride = node => ((
          node.scrollHeight > node.clientHeight
          && WINDOW.getComputedStyle(node).overflowY.indexOf('hidden') !== -1
        ) || (
            node.scrollWidth > node.clientWidth
            && WINDOW.getComputedStyle(node).overflowX.indexOf('hidden') !== -1
          )) && attrOveride(node, 'onscroll', throttle(() => {
            record('scroll', {
              scrollPercentageX: Math.round(100 * node.scrollLeft / Math.max((node.scrollWidth - node.clientWidth), 1)),
              scrollPercentageY: Math.round(100 * node.scrollTop / Math.max((node.scrollHeight - node.clientHeight), 1)),
            }, node, null, 'gesture')
          }, 1000)),
        onload = () => {
          let node = document.body, queue = [node];
          while (node = queue.pop()) {
            // Add children node to the queue.
            for (let i = 0, cn = node.childNodes || [], l = cn.length; i !== l; ++i) queue.push(cn[i]);

            // Check if node is attached an onclick attribute.
            if (node.tagName !== 'script') {
              clickAttrOveride(node, 'onclick');
              clickAttrOveride(node, 'onmouseup');
              clickAttrOveride(node, 'onmousedown');
              clickAttrOveride(node, 'ontouchstart');
              clickAttrOveride(node, 'ontouchend');
              scrollAttrOveride(node);
            }
          }

          // Page crash.
          if (STORAGE) {
            STORAGE.setItem(GOOD_EXIT, 'pending');
            setInterval(() => STORAGE.setItem(TIME_BEFORE_CRASH, Date.now()), 1000);

            // To check if tab is duplicated.
            STORAGE.setItem(WINDOW_NAME, getWindowName());
          }

          // Record session start.
          record('start', null, document.body, null, 'session');

          // Remove the listener.
          WINDOW.removeEventListener('load', onload);
        },
        getWindowName = (defaultName) => {
          try {
            defaultName = WINDOW.name || `${WINDOW.performance.navigation.type}`;
          } catch { }
          return defaultName;
        },
        GOOD_EXIT = `${PREFIX}-good-exit`,
        TIME_BEFORE_CRASH = `${PREFIX}-time-before-crash`,
        WINDOW_NAME = `${PREFIX}-window-name`,

        // Method overloading to capture events.
        addEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function (type, func, ...args) {
        return addEventListener.apply(this, [
          type,
          ((type = type.toLowerCase()) === 'click'
            || type === 'touchstart'
            || type === 'touchend'
            || type === 'mouseup'
            || type === 'mousedown') && function (...v) {
              record(type, null, this, null, 'gesture');
              return typeof func === 'function' && func(...v);
            } || func,
          ...args
        ]);
      }

      // Add load listener.
      WINDOW.addEventListener('load', onload);

      // Add beforeunload listener, for page crashes and end session.
      STORAGE && WINDOW.addEventListener(
        'beforeunload',
        () => {
          // For page crashes.
          STORAGE.setItem(GOOD_EXIT, 'true');

          // Record session end.
          record('end', null, document.body, null, 'session');
        }
      );

      // Record crashes.
      WINDOW.addEventListener('error', e => {
        record('', null, null, {
          message: e.message,
          filename: e.filename,
          line: e.lineno,
          column: e.colno
        }, 'error');
      });

      if (STORAGE && STORAGE.getItem(WINDOW_NAME) === getWindowName() && STORAGE.getItem(GOOD_EXIT) !== 'true') {
        record('', null, null, {
          message: 'Unresponsive code/page',
          timeBeforeCrash: STORAGE.getItem(TIME_BEFORE_CRASH)
        }, 'error');
      }

      // To send a custom event, width additional data.
      WINDOW[NAMESPACE].sendCustomEvent = (eventName, data, userID) => {
        if (!eventName || typeof eventName !== 'string')
          throw Error('In sendCustomEvent: first argument must be a non-empty event identifier string');
        else return record(eventName, data, null, null, 'custom', userID);
      };

    } // END OF IF SEND

    // Remove script node from dom.
    script.remove();

  } // END OF CODE.
})();