const { DOC, WIN, NAV, A, CB, EP, EK, OA, C, DC } = require('./globals');
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
    // Add more private data.
    A && (data.ids.account = A);
    const otherAnalyticsIds = {};
    let k, v, f;
    for (k in OA) (v = OA[k]) && (v.length || v.size) && (otherAnalyticsIds[k] = Array.from(v), f = true);
    f && (data.ids.otherAnalytics = otherAnalyticsIds);
    const cookies = getCookies(`${C && C + ';' || ''}${DOC.cookie}`);
    cookies && Object.keys(cookies).length && (
      data.cookies = cookies,
      DC && (data.disableCookies = DC)
    );

    // Encrypt the data if needed.
    if (_ek) {
      try {
        data.ids.user && (data.ids.user = ec(data.event.ids.user, _ek));
        data.event.body && (data.event.body = ec(data.event.body, _ek));
        data.element.identifier && (data.element.identifier = ec(data.element.identifier, _ek));
        data.encrypted = ['ids.user', 'event.body', 'element.identifier'];
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
