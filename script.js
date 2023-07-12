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
  let WIN, NAV, DOC, MQ, MOB, IS_APPLE, STO, LOC, TZO = Math.round((new Date).getTimezoneOffset() / 60);
  try {
    WIN = window;
    NAV = WIN.navigator || navigator;
    DOC = WIN.document || document;
    LOC = WIN.location || location;
  } catch { };

  // We need the basics to make the code work.
  if (WIN && NAV && DOC) {

    // Get storage.
    try {
      STO = sessionStorage;
    } catch { }

    // Prefix storage variables.
    const PREFIX = 'aglx',

      // Get current script parameters.
      scs = DOC.getElementsByTagName && DOC.getElementsByTagName('script'),
      sc = scs[scs.length - 1],
      EK = sc && ( // Encryption key
        sc.getAttribute('apikey')
        || sc.getAttribute('key')
        || sc.getAttribute('publickey')
        || sc.getAttribute('api-key')
        || sc.getAttribute('public-key')
        || sc.getAttribute('data-api-key')
        || sc.getAttribute('data-key')
        || sc.getAttribute('data-public-key')
      ),
      A = sc && ( // Account id
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
      NAMESPACE = sc.getAttribute('namespace') || 'angelitics',
      CB = sc.getAttribute('callback')
        || sc.getAttribute('cb')
        || sc.getAttribute('data-callback')
        || sc.getAttribute('data-cb'),

      // Get system parameters.
      // MOB: ios | android | windows | other | false
      // BROWSER: chrome | chromium | seamonkey | firefox | opera | ie | false
      // RENDERING_ENGINE: blink | gecko | webkit | false
      // DEVICE_TYPE: phone | tablet | large-tablet | desktop
      // IS_APPLE: true | false
      // HAS_TOUCH_SCREEN: true | false
      VENDOR = NAV.vendor || '',
      USER_AGENT = NAV.userAgent || '',
      IS_ANDROID_MOB = /Android|Opera Mini/.test(USER_AGENT) || WIN.Android || false,
      IS_WINS_MOB = /Windows Phone|IEMobile/.test(USER_AGENT),
      IS_OTHER_MOB = /webOS|BlackBerry/.test(USER_AGENT),
      IS_IOS_MOB = /iP(hone|ad|od)/.test(USER_AGENT)
        && WIN.webkit
        && !(IS_ANDROID_MOB || IS_WINS_MOB || IS_OTHER_MOB);
    MOB = (IS_IOS_MOB && 'ios')
      || (IS_ANDROID_MOB && 'android')
      || (IS_WINS_MOB && 'windows')
      || (IS_OTHER_MOB && 'other');
    const HAS_TOUCH_SCREEN = !!MOB
      || NAV.maxTouchPoints > 0
      || NAV.msMaxTouchPoints > 0
      || (
        (MQ = ((WIN.matchMedia || (() => { }))('(pointer:coarse)') || {}))
        && MQ.media === '(pointer:coarse)'
        && !!MQ.matches
      ) || !!WIN.orientation;
    HAS_TOUCH_SCREEN || (MOB = false);

    IS_APPLE = /Apple/.test(VENDOR);
    const IS_SAFARI = /Safari/.test(USER_AGENT) && IS_APPLE;
    IS_APPLE || (IS_APPLE = /Mac/.test(USER_AGENT));
    const IS_GOOGLE = /Google/.test(VENDOR),
      IS_CHROMIUM = /Chromium/.test(USER_AGENT) && IS_GOOGLE,
      IS_CHROME = ((/Chrome/.test(USER_AGENT) && IS_GOOGLE) || (WIN.chrome && (WIN.chrome.webstore || WIN.chrome.runtime))) && !IS_CHROMIUM,
      IS_SEAMONKEY = /Seamonkey/.test(USER_AGENT),
      IS_FIREFOX = (/Firefox/.test(USER_AGENT) || typeof InstallTrigger !== 'undefined') && !IS_SEAMONKEY,
      IS_OPERA = /OPR|Opera/.test(USER_AGENT),
      IS_IE = /MSIE|Trident.*rv\:11\./.test(USER_AGENT) || /*@cc_on!@*/false || !!DOC.documentMode,
      BROWSER = (IS_SAFARI && 'safari')
        || (IS_CHROME && 'chrome')
        || (IS_CHROMIUM && 'chromium')
        || (IS_SEAMONKEY && 'seamonkey')
        || (IS_FIREFOX && 'firefox')
        || (IS_OPERA && 'opera')
        || (IS_IE && 'ie'),
      IS_GECKO = /Mobile|Tablet/.test(USER_AGENT) && /Gecko|Firefox/.test(USER_AGENT) && /Mozilla/.test(USER_AGENT) || IS_FIREFOX,
      IS_EDGE = (!IS_IE && !!WIN.StyleMedia) || (IS_CHROME && /Edg/.test(USER_AGENT)),
      IS_BLINK = (IS_CHROME || IS_OPERA) && !!WIN.CSS,
      IS_WEBKIT = /KHTML/.test(USER_AGENT) && /AppleWebKit/.test(USER_AGENT),
      RENDERING_ENGINE = (IS_EDGE && 'edge')
        || (IS_BLINK && 'blink')
        || (IS_GECKO && 'gecko')
        || (IS_WEBKIT && 'webkit'),
      WIDTH = WIN.innerWidth || WIN.documentElement.clientWidth,
      DEVICE_TYPE = MOB && (
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
            isMobile: MOB,
            hasTouchScreen: HAS_TOUCH_SCREEN,
            isApple: IS_APPLE,
            language: NAV.language
          },
          location: parseUrl(LOC.href),
          date: Date.now(),
          timeZoneOffset: TZO,
          sessionId: SID,
          title: DOC.title
        };
        DOC.referrer && (data.referrer = parseUrl(DOC.referrer));

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

      ec = function() { // Encryption function

        // Global variables
        // ################
        
        // secp256k1 is a short weierstrass curve
        let B256 = 0x10000000000000000000000000000000000000000000000000000000000000000n, // max range = 2n ** 256n
        R = 0x1000003d1n,
        P = 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2fn, // = B256 - R curve's field prime
        INV_E = 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2dn, // = P - 2n used for modular inverse,
        TRIALS = 255n, // used in x2point
        P_TRIALS = P - TRIALS, // used in msg2points
        N_1 = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140n, // used in getRandomNum
        SQRT_E = 0x3fffffffffffffffffffffffffffffffffffffffffffffffffffffffbfffff0cn, // used in sqrt
        K = 0xc9bd1905155383999c46c2c295f2b761bcb223fedc24a059d838091dd2253531n, // used for Montgomery reduction
        MR_MASK = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
        G = [ // base point on the curve
          0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n, // base point x
          0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n, // base point y
          1n
        ],
        I = [0n, 1n, 0n], // point at infinity
        
        // Utility functions
        // #################
        
        // Modulo division
        mod = (a, md = P, r = a % md) => r >= 0n ? r : md + r, // robust against time attack
        
        // Montgomery reduction-based multiplication.
        mrmul = (
          a,
          b = R,
          md = P,
          ab = a * b,
          reduced = (ab + (((ab & MR_MASK) * K) & MR_MASK) * md) >> 256n,
          _reduced = reduced - md // to prevent side channel attacks
        ) => _reduced > 0 && _reduced || reduced,
        
        exp = (num, p = SQRT_E, md = P, r = R, f = R) => {
          // Compute input in Montgomrey form x = xr mod n
          // where r = B256 and n = md.
          num = mod(num << 256n, md);
        
          for (let g; p; p >>= 1n, num = mrmul(num, num, md)) {
            f = mrmul(r, num, md);
            p & 1n && (r = f) || (g = f); // to prevent side channel attacks
          }
        
          // Convert back the result.
          r = (r + mod(r * K, B256) * md) / B256;
          f = r - md; // to prevent side channel attacks
          return f > 0 && f || r;
        },
        
        // Inverse modulo division
        // Uses Fermat's little theorem:
        // a^P = 1 mod P, a^(P - 1) = 0 mod P, a^(P - 2) = a^(-1) mod P
        // slower but more robust towards side channel attacks
        inv = num => exp(num, INV_E),
        
        // Square root.
        // Paper: "Square Roots from 1;24,51,10 to Dan Shanks"
        sqrt = exp,
        
        // x³ + ax + b weierstrass formula; a = 0, b = 7
        crv = x => mod(mod(mod(x * x) * x) + 7n),
        
        // Creates Uint8Array (aka bytes), with default length = 32.
        createBytes = (data = 32) => new Uint8Array(data),
        
        // Bytes to BigInt number.
        // Here bytes should always have a deterministic size
        // i.e. either 32 or longer depending on the code schema
        // So no time attack possible here.
        bytes2num = (bytes, num = 0n) => {
          for (let i = 0, l = bytes.length, v = 0n; i !== l; ++i) {
            num = v + BigInt(bytes[i]);
            v  = num << 8n;
          }
          return num;
        },
        
        // BigInt number to hex.
        // Num range on the elliptic curve field should always
        // produce an hex of size 64 (66 with the 0x padding).
        // So no time attack possible here.
        num2hex = (num, pre = '0x', hex = '') => {
          let v, f = '';
          while(num) {
            (v = (num & 255n).toString(16)).length === 1 && (v = '0' + v) || (f = '0' + f); // to prevent side channel attacks
            hex = v + hex;
            num >>= 8n;
          }
          return pre + (hex || '00');
        },
        
        // Hex to BigInt number.
        // hex size deterministic: no time attack possible here.
        hex2num = hex => BigInt(hex),
        
        // Convert generic input to BigInt.
        toNum = input => (
          typeof input === 'bigint'
          && input
          || (
            typeof input === 'string'
            && hex2num(input.charAt(1) === 'x' && input || '0x' + input)
            || bytes2num(input)
          )
        ),
        
        // Convert bytes to point
        // Recover y if compressed
        // Bytes should be of size 33 or 65
        bytes2point = bytes => {
          let isCompressed = bytes[0], x = bytes2num(bytes.slice(1, 33)), y;
          isCompressed ?
            !((y = sqrt(crv(x))) & 1n) !== !(isCompressed & 1) && (y = mod(-y))
            : y = bytes2num(bytes.slice(33, 65));
          return [x, y, 1n];
        },
        
        // Convert point to hex
        // Transform point into its affine counterpart and array-ify it.
        point2hex = (
          point,
          isCompressed = true,
          pre = '0x',
          [x, y] = toAffine(point), // Convert to 2d xy affine point.
          hex = pre
            + (isCompressed && (y & 1n && '01' || '02') || '00')
            + num2hex(x, '')
        ) => isCompressed && hex || hex + num2hex(y, ''),
        
        // Convert hex to point
        // Recover y if compressed
        hex2point = (
          hex,
          x = hex2num('0x' + hex.slice(4, 68)),
          y,
          c = hex.charAt(3)
        ) => c === '0' && [
          x,
          hex2num('0x' + hex.slice(68, 132)),
          1n
        ] || [
          x,
          !((y = sqrt(crv(x))) & 1n) === (c === '1') && mod(-y) || y,
          1n
        ],
        
        // Convert generic input to point.
        toPoint = input => (
          typeof input === 'bigint'
          && hex2point(num2hex(input))
          || (
            typeof input === 'string'
            && hex2point(input.charAt(1) === 'x' && input || '0x' + input)
            || bytes2point(input)
          )
        ),
        
        // Produces random values.
        getRandomBytes = function () {
          let random = Math.random,
            now = Date.now,
            floor = Math.floor,
            getRandomValues = Crypto && Crypto.getRandomValues;
          return getRandomValues && (
            (len = 32) => getRandomValues(createBytes(len))
          ) || ((len = 32) => {
            let v, i = 0, bytes = createBytes(len);
            while (i !== len) {
              // v = mix between a big random number and a date.
              v = BigInt(floor(now() + random() * 1e17));
              while (v && i !== len) {
                bytes[i++] = Number(v & 255n);
                v >>= 8n;
              }
            }
            return bytes;
          })
        }(),
        
        // Produces a random number with modulo bias from hash.
        getRandomNum = (hash = getRandomBytes()) => mod(
          toNum(hash), N_1
        ) + 1n,
        
        // Helper function to convert utf16 into utf8.
        utf16To8 = function () {
          const f = (_, n) => String.fromCharCode(parseInt(n, 16)),
            unescape = s => s.replace(/%([0-9A-F]{2})/ig, f);
          return str => {
            try {
              return unescape(encodeURIComponent(str));
            } catch {
              //include invalid character, cannot convert
              return str;
            }
          };
        }(),
        
        // Convert data to message.
        data2msg = data => utf16To8(JSON.stringify(data)),
        
        // Geometric functions
        // ###################
        
        // Function to convert point to the affine plane.
        // (x, y, z) ∋ (x=x/z, y=y/z)
        toAffine = ([x = 0n, y = 0n, z = 1n] = []) => {
          if (!z) return [0n, 0n, 1n]; // fast-path for zero point
          if (z === 1n) return [x, y, z]; // if z is 1, pass affine coordinates as-is
          const iz = inv(z); // z^-1: invert z
          return [mod(x * iz), mod(y * iz), 1n]; // x = x*z^-1; y = y*z^-1
        },
        
        // Flip point over y coord.
        negate = ([x = 0n, y = 0n, z = 1n] = []) => [x, -y, z],
        
        // Function to check points equality,
        // i.e. x1z2 === x2z1 && y1z2 === y2z1
        areEqual = (
          [x1 = 0n, y1 = 0n, z1 = 1n] = [],
          [x2 = 0n, y2 = 0n, z2 = 1n] = []
        ) => mod(x1 * z2) === mod(x2 * z1) && mod(y1 * z2) === mod(y2 * z1),
        
        // Scalar multiplication algorithm: double-and-add | time attack insensitive
        mul = (n = getRandomNum(), [x = 0n, y = 0n, z = 1n] = G) => {
          let p = I, f = G, d = [x, y, z]; // init result point & fake point
          for (; n > 0n; d = double(d), n >>= 1n) { // double-and-add ladder
            (n & 1n) && (p = add(p, d)) // if bit is present, add to point
              || (f = add(f, d));       // if not, add to fake for timing safety
          }
          return p;
        },
        
        // Algorithm 7 (case a = 0): https://eprint.iacr.org/2015/1060.pdf
        // Keep in mind: we’re working in a finite field over some big prime P.
        // This basically means all operations — additions, multiplications,
        // subtractions — would be done modulo P
        add = (
          [x1 = 0n, y1 = 0n, z1 = 1n] = [],
          [x2 = 0n, y2 = 0n, z2 = 1n] = []
        ) => {
          let t0 = mod(x1 * x2), // step 1
          t1 = mod(y1 * y2), // step 2
          t2 = mod(z1 * z2), // step 3
          t3 = mod(x1 + y1), // step 4
          t4 = mod(x2 + y2), // step 5
          x3, y3, z3;
          t3 = mod(t3 * t4); // step 6
          t4 = mod(t0 + t1); // step 7
          t3 = mod(t3 - t4); // step 8
          t4 = mod(y1 + z1); // step 9
          x3 = mod(y2 + z2); // step 10
          t4 = mod(t4 * x3); // step 11
          x3 = mod(t1 + t2); // step 12
          t4 = mod(t4 - x3); // step 13
          x3 = mod(x1 + z1); // step 14
          y3 = mod(x2 + z2); // step 15
          x3 = mod(x3 * y3); // step 16
          y3 = mod(t0 + t2); // step 17
          y3 = mod(x3 - y3); // step 18
          x3 = mod(t0 + t0); // step 19
          t0 = mod(x3 + t0); // step 20
          t2 = mod(21n * t2); // step 21
          z3 = mod(t1 + t2); // step 22
          t1 = mod(t1 - t2); // step 23
          y3 = mod(21n * y3); // step 24
          x3 = mod(t4 * y3); // step 25
          t2 = mod(t3 * t1); // step 26
          x3 = mod(t2 - x3); // step 27
          y3 = mod(y3 * t0); // step 28
          t1 = mod(t1 * z3); // step 29
          y3 = mod(t1 + y3); // step 30
          t0 = mod(t0 * t3); // step 31
          z3 = mod(z3 * t4); // step 32
          z3 = mod(z3 + t0); // step 33
          
          return [x3, y3, z3];
        },
        
        // Point doubling:
        // Algorithm 9 (case a = 0): https://eprint.iacr.org/2015/1060.pdf
        double = ([x = 0n, y = 0n, z = 1n] = []) => {
          let t0 = mod(y * y),   // step 1
          t1 = mod(y * z),   // step 5
          t2 = mod(z * z),   // step 6
          x3, y3, z3;
          z3 = mod(t0 + t0); // step 2
          z3 = mod(z3 + z3); // step 3
          z3 = mod(z3 + z3); // step 4
          t2 = mod(21n * t2); // step 7
          x3 = mod(t2 * z3); // step 8
          y3 = mod(t0 + t2); // step 9
          z3 = mod(t1 * z3); // step 10
          t1 = mod(t2 + t2); // step 11
          t2 = mod(t1 + t2); // step 12
          t0 = mod(t0 - t2); // step 13
          y3 = mod(t0 * y3); // step 14
          y3 = mod(x3 + y3); // step 15
          t1 = mod(x * y);   // step 16
          x3 = mod(t0 * t1); // step 17
          x3 = mod(x3 + x3); // step 18
          
          return [x3, y3, z3];
        },
        
        // Used to speed up multiplication with a point on the curve, like G.
        W = 2 ** 3,
        NUM_WINS = 256 / W + 1,
        MAX_NUMBER = 2 ** W,
        WIN_SIZE = MAX_NUMBER >> 1,
        MASK = BigInt(MAX_NUMBER - 1),
        SHIFT_BY = BigInt(W),
        precomputesG = [],
        precomputesPublicKey = [],
        PUBLIC_KEY = undefined,
        precomputeWindows = (base = G, points = precomputesG) => {
          if (points.length) return points;
          let p = base, w = 0, i;
          for (; w < NUM_WINS; ++w) {
            base = p;
            points.push(base);
            for (i = 1; i < WIN_SIZE; ++i) points.push(base = add(base, p));
            p = double(base);
          }
          return points;
        },
        wNAF = function() {
          const abs = Math.abs;
          return (n, precomputes) => {
            let p = I, f = I, w = 0, o = 0, o2, wbits, cached, ncached;
        
            for (; w < NUM_WINS; ++w, o += WIN_SIZE) {
              // Extract W bits.
              wbits = Number(n & MASK);
        
              // Shift number by W bits.
              n >>= SHIFT_BY;
        
              // If the bits are bigger than max size, we’ll split those.
              // +224 => 256 - 32
              if (wbits > WIN_SIZE) {
                wbits -= MAX_NUMBER;
                n += 1n;
              }
        
              // Check if we’re onto Zero point.
              // Add random point inside current window to f.
              o2 = o + abs(wbits) - 1;
              if (wbits === 0) {
                cached = precomputes[o];
                ncached = negate(cached);
                f = add(f, wbits < 0 && ncached || cached);
              } else {
                cached = precomputes[o2];
                ncached = negate(cached);
                p = add(p, wbits < 0 && ncached || cached);
              }
            }
            return p;
          }
        }(),
        
        // Multiply G by a number.
        mulG = (n = getRandomNum()) => wNAF(n, precomputeWindows(G, precomputesG)),
        
        // Multiply PUBLIC_KEY by a number.
        mulPublicKey = (n = getRandomNum(), publicKey) => {
          PUBLIC_KEY || (PUBLIC_KEY = publicKey);
          return areEqual(publicKey, PUBLIC_KEY)
            && wNAF(n, precomputeWindows(PUBLIC_KEY, precomputesPublicKey))
            || mul(n, publicKey);
        },
        
        // Crypto functions
        // ################
        
        // Create a point + residual from input x coordinate
        // x is not necessarily on the field
        x2point = x => {
          let v, vv, i = 0n, o, f, q;
          for (;i !== TRIALS; ++i) { // constant number of operations to find the point, to prevent side channel attacks
            vv = crv(x + i);
            v = sqrt(vv);
            if (vv === mod(v * v)) { // constant number of assignment, to prevent side channel attacks
              o = i;
              y = v;
            } else {
              f = i;
              q = v;
            }
          }
          if (o === undefined) throw Error(`could not find a proper point for x = ${x}`);
          return [x + o, y, 1n, o];
        },
        
        // Create a point + residual set of points from a message.
        msg2points = msg => {
          let l = msg.length, a = [], n = 0n, b = 0n, i = 0, v, nn;
          try {
            for(; i !== l; ++i, b += 8n) {
              v = BigInt(msg.charCodeAt(i));
              if ((nn = n + (v << b)) >= P_TRIALS) {
                a.push(x2point(n));
                b = 0n;
                n = v;
              } else n = nn;
            }
          } catch (e) {
            throw Error(`could not encode msg = ${msg} (${e})`);
          }
          n && a.push(x2point(n));
        
          return a;
        };
        
        // Encrypt.
        return (data, publicKey, isCompressed = true, r = getRandomNum()) => {
          data = msg2points(data2msg(data));
        
          // Ecode message: M + r * publicKey.
          // First start encrypted message with r * G
          let i = 0, l = data.length, d,
            rP = toAffine(mulPublicKey(r, toPoint(publicKey))),
            m = point2hex(mulG(r), isCompressed, ''); // start with r * G
          
          // Then, encode messages by chuncks.
          for (; i !== l; ++i) {
            d = data[i];
            m += point2hex(add(d, rP), isCompressed, '')
              + num2hex(d[3] >> 8n, '')
              + num2hex(d[3] & 255n, '');
          }
        
          // Return encrypted message.
          return m;
        };
        
      }(), // END of encrypt code

      // Function to send data to servers.
      send = CB && typeof WIN[CB] === 'function' && ((...data) => WIN[CB].apply(WIN, data))
        || (A && (async (
          data, // data to send
          encryptionKey, // if true or a key, will encrypt using ECC Secp256k1 Encryption (aka Bitcoin encryption)
          uri = 'https://api.angelytics.ai/api/event', // where to send it
          _ek = encryptionKey && typeof encryptionKey !== 'string' && EK || encryptionKey
        ) => {
          // @Tristan: remove the console.log for production
          // console.log('sending data to server...', data);

          // Encrypt the data if needed.
          data = {
            accountId: A,
            ...data,
          };
          if (_ek) {
            try {
              data.userId && (data.userId = ec(data.userId, _ek));
              data.body && (data.body = ec(data.body, _ek));
              data.flag = 1;
            } catch (error) {
              // Could not encrypt the message.
              // It can happen with a probability of 1 / (2^256)
              return Promise.reject(error);
            }
          }

          // Try to stringify the content.
          // Could fail if data contains cycles.
          try {
            data = JSON.stringify(data);
          } catch (error) {
            // Handle the error
            // @Tristan: is it the best way to handle the error?
            console.error(error);
            return Promise.reject(error);
          }

          // Send data.
          return fetch(uri, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: data
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
              // @Tristan: is it the best way to handle the error?
              console.error(error);
              return Promise.reject(error);
            });
        })),
      SN = `${PREFIX}-session-id`,
      SID = STO && function (id = STO.getItem(SN) || '') {
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

    WIN[NAMESPACE] = {
      // To get metadata.
      getMetadata,
      // Throttle helper function
      throttle
    };

    // Overide code only if we can send the data somewhere.
    if (send) {
      // Function to record the click.
      const record = ({
        eventName,
        data: _data,
        body = _data,
        elmt,
        error,
        type,
        userId,
        ect, // Encryption
        url, uri = url,
        extra, detail = extra, details = detail
      } = {}) => {
        // Get the device data.
        const data = getMetadata(elmt);
        type && (data.eventType = type);
        error && (data.error = error);
        eventName && (data.eventName = eventName);
        details && typeof details === 'object' && Object.assign(data.details || (data.details = {}), details);
        body && (data.body = body);
        (typeof userId === 'number' || userId) && (data.userId = typeof userId === 'object' && JSON.stringify(userId) || `${userId}`)

        // Send data.
        send(data, ect, uri);
        return data;
      },

      // Overide Helper function.
    attrOveride = (
        node,
        prop,
        cb,
        force = false,
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
      ) || (
        force && (node === DOC.body && DOC || node).addEventListener(prop.slice(2), cb)
      ),

      // Overide direct gesture event functions.
      clickAttrOveride = (node, prop) => attrOveride(
        node,
        prop,
        () => record({
          eventName: prop.toLowerCase().slice(2),
          elmt: node,
          type: 'gesture'
        })
      ),

      // Overide scrolling event.
      canScroll = (node, scrollAxis) => {
        if (node[scrollAxis] === 0) {
          node[scrollAxis] = 1;
          if (node[scrollAxis] === 1) {
            node[scrollAxis] = 0;
            return true;
          }
        } else return true;
        return false;
      },
      scrollAttrOveride = node => (
        (
          (
            node.scrollHeight > node.clientHeight
            || (node === document.body && node.clientHeight > WIN.innerHeight)
            || canScroll(node, 'scrollTop')
          )
          && WIN.getComputedStyle(node).overflowY.indexOf('hidden') === -1
        ) || (
            (
              node.scrollWidth > node.clientWidth
              || (node === document.body && node.clientWidth > WIN.innerWidth)
              || canScroll(node, 'scrollLeft')
            )
            && WIN.getComputedStyle(node).overflowX.indexOf('hidden') === -1
        )
      ) && attrOveride(node, 'onscroll', ((
        timeoutId = 0,
        xmin = Infinity,
        ymin = Infinity,
        xmax = 0,
        ymax = 0,
        xstart,
        ystart,
        x, y,
        p = (v, r) => Math.min(Math.max(Math.round(100 * v / r), 0), 100),
        f = () => {
          let w = Math.max((node.scrollWidth - (node === document.body && WIN.innerWidth || node.clientWidth))),
            h = Math.max((node.scrollHeight - (node === document.body && WIN.innerHeight || node.clientHeight))),
            o;
          xmin !== xmax && ((o || (o = {})).horizontalScroll = {range: [p(xmin, w), p(xmax, w)], start: p(xstart, w), end: p(x, w)});
          ymin !== ymax && ((o || (o = {})).verticalScroll = {range: [p(ymin, h), p(ymax, h)], start: p(ystart, h), end: p(y, h)});
          o && record({
            eventName: 'scroll',
            elmt: node,
            type: 'gesture',
            extra: o
          });
          xmin = ymin = Infinity;
          xmax = ymax = 0;
          xstart = ystart = undefined;
        }
      ) => throttle(() => {
          if (node === document.body) {
            x = WIN.scrollX;
            y = WIN.scrollY;
          } else {
            x = node.scrollLeft;
            y = node.scrollTop;
          }
          if (xstart === undefined) {
            xstart = x;
            ystart = y;
          }
          xmin = Math.min(x, xmin);
          ymin = Math.min(y, ymin);
          xmax = Math.max(x, xmax);
          ymax = Math.max(y, ymax);
          clearTimeout(timeoutId);
          timeoutId = setTimeout(f, 500); // f only triggered if not scrolled after 500ms
        }, 50)
      )(), true),
      onload = () => {
        let node = document.body, queue = [node], tn;
        while (node = queue.pop()) {
          // Add children node to the queue.
          for (let i = 0, cn = node.childNodes || [], l = cn.length; i !== l; ++i) queue.push(cn[i]);

          // Check if node is attached an onclick attribute.
          tn = (node.tagName || '').toLowerCase();
          if (tn && tn !== 'script' && tn !== 'br') {
            clickAttrOveride(node, 'onclick');
            clickAttrOveride(node, 'onmouseup');
            clickAttrOveride(node, 'onmousedown');
            clickAttrOveride(node, 'ontouchstart');
            clickAttrOveride(node, 'ontouchend');
            scrollAttrOveride(node);
          }
        }

        // Page crash.
        if (STO) {
          STO.setItem(GOOD_EXIT, 'pending');
          setInterval(() => STO.setItem(TIME_BEFORE_CRASH, Date.now()), 1000);

          // To check if tab is duplicated.
          STO.setItem(WIN_NAME, getWindowName());
        }

        // Record session start.
        record({
          eventName: 'start',
          elmt: document.body,
          type: 'session'
        });

        // Remove the listener.
        WIN.removeEventListener('load', onload);
      },
      getWindowName = (defaultName) => {
        try {
          defaultName = WIN.name || `${WIN.performance.navigation.type}`;
        } catch { }
        return defaultName;
      },
      GOOD_EXIT = `${PREFIX}-good-exit`,
      TIME_BEFORE_CRASH = `${PREFIX}-time-before-crash`,
      WIN_NAME = `${PREFIX}-window-name`,

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
              record({
                eventName: type,
                elmt: this,
                type: 'gesture'
              });
              return typeof func === 'function' && func(...v);
            } || func,
          ...args
        ]);
      }

      // Add load listener.
      WIN.addEventListener('load', onload);

      // Add beforeunload listener, for page crashes and end session.
      STO && WIN.addEventListener(
        'beforeunload',
        () => {
          // For page crashes.
          STO.setItem(GOOD_EXIT, 'true');

          // Record session end.
          record({
            eventName: 'end',
            elmt: document.body,
            type: 'session'
          });
        }
      );

      // Record crashes.
      WIN.addEventListener('error', e => {
        record({
          eventName: 'code',
          error: {
            message: e.message,
            filename: e.filename,
            line: e.lineno,
            column: e.colno
          },
          type: 'error'
        });
      });

      if (STO && STO.getItem(WIN_NAME) === getWindowName() && STO.getItem(GOOD_EXIT) !== 'true') {
        record({
          eventName: 'crash',
          error: {
            message: 'Unresponsive code/page',
            timeBeforeCrash: STO.getItem(TIME_BEFORE_CRASH)
          },
          type: 'error'
        });
      }

      // To send a custom event, width additional data.
      WIN[NAMESPACE].sendCustomEvent = (eventName, data, userId, useEncryption) => {
        if (!eventName || typeof eventName !== 'string')
          throw Error('In sendCustomEvent: first argument must be a non-empty event identifier string');
        else return record({
          eventName,
          body: data, 
          type: 'custom',
          userId,
          ect: useEncryption
        });
      };

    } // END OF IF SEND

    // Remove script node from dom.
    sc.remove();

  } // END OF CODE.
})();