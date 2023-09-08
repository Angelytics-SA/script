const { DOC, WIN, NAV, A, CB, EP, EK, OA, C, DC, P, AL, DA } = require('./globals');
const ec = require('./eecClientEncrypt');
const afy = require('./asyncify');
const getCookies = require('./getCookies');

// Function to send data to servers.
module.exports = CB && typeof WIN[CB] === 'function' && afy((...data) => WIN[CB].apply(WIN, data))
  || (A && (
  async (
    data, // data to send
    encryptionKey, // if true or a key, will encrypt using ECC Secp256k1 Encryption (aka Bitcoin encryption)
    uri = EP, // where to send it
    _ek = encryptionKey && typeof encryptionKey !== 'string' && EK || encryptionKey
  ) => {
    // Add account id if needed.
    A && (data.ids.account = A);

    // Add other analytics ids if needed.
    const otherAnalyticsIds = {};
    let k, v, f;
    for (k in OA) (v = OA[k]) && (v.length || v.size) && (otherAnalyticsIds[k] = Array.from(v), f = true);
    f && (data.ids.otherAnalyticsToFeed = otherAnalyticsIds);

    // Add flag about patching and allowing othe analytics.
    data.flags = {
      patch: P,
      allowAll: AL,
      disableCookies: DC,
      encrypted: !!_ek
    };
    
    // Add cookies if needed.
    const cookies = getCookies(`${C && C + ';' || ''}${DOC.cookie}`);
    cookies && Object.keys(cookies).length && (data.cookies = cookies);

    // Add detected analytics.
    let detected = {};
    DA.length && (detected = data.ids.otherAnalyticsDetected = DA.reduce((o, [k, v]) => {
      o[k] && o[k].add(v) || (o[k] = new Set([v]));
      return o;
    }, {}));
    for (const k in detected) detected[k] = Array.from(detected[k]);

    // Encrypt the data if needed.
    if (_ek) {
      try {
        // Location and referrer can contain sensitive param information.
        data.page.location && (data.page.location = ec(data.page.location, _ek));
        data.page.referrer && (data.page.referrer = ec(data.page.referrer, _ek));
        // Custom user id is sensitve info.
        data.ids.user && (data.ids.user = ec(data.event.ids.user, _ek));
        // Body info can be sensitve.
        data.event.body && (data.event.body = ec(data.event.body, _ek));
        // Element identifier (such class, id etc) can contain sensitive info.
        data.element.identifier && (data.element.identifier = ec(data.element.identifier, _ek));
        // List of encrypted data.
        data.flags.encrypted = [
          'page.location',
          'page.referrer',
          'ids.user',
          'event.body',
          'element.identifier'
        ];
      } catch (error) {
        // Could not encrypt the message.
        // It can happen with a probability of 1 / (2^256)
        return Promise.reject(error);
      }
    }

    // console.log('SENT', JSON.stringify(data, null, 2));
    // return Promise.resolve(true);

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

    // Use sendBeacon if possible.
    try {
      const queued = NAV.sendBeacon(uri, data);
      return queued && Promise.resolve(queued) || Promise.reject('analytics not queued');
    } catch {
      // Send data using the traditional fetch.
      return fetch(uri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        keepalive: true,
        credentials: 'include',
        mode: 'no-cors',
        body: data
      });
    }
  })
);
