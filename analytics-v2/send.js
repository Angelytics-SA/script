const { WIN, NAV, A, CB, EP, OA, DC, P, AL, DA, DV } = require('./globals');
const afy = require('./asyncify');

// Function to send data to servers.
module.exports = CB && typeof WIN[CB] === 'function' && afy((...data) => WIN[CB].apply(WIN, data))
  || (A && (
  async (
    data, // data to send
    uri = EP, // where to send it
  ) => {
    // Add account id if needed.
    A && (data.ids.account = A);

    // Add other analytics ids if needed.
    try {
      const otherAnalyticsIds = {};
      let k, v, f;
      for (k in OA) (v = OA[k]) && (v.length || v.size) && (otherAnalyticsIds[k] = Array.from(v), f = true);
      f && (data.ids.otherAnalyticsToFeed = otherAnalyticsIds);
    } catch {}

    // Add flag about patching and allowing othe analytics.
    data.flags = {
      mode: DV && 'dev' || 'prod',
      patch: P,
      allowAll: AL,
      disableCookies: DC,
      encrypted: !!_ek
    };

    // Add detected analytics.
    try {
      let detected = {};
      DA.length && (detected = data.ids.otherAnalyticsDetected = DA.reduce((o, [k, v]) => {
        o[k] && o[k].add(v) || (o[k] = new Set([v]));
        return o;
      }, {}));
      for (const k in detected) detected[k] = Array.from(detected[k]);
    } catch {}

    // Try to stringify the content.
    // Could fail if data contains cycles.
    try {
      data = JSON.stringify(data);
    } catch (e) {
      // Handle the error
      return Promise.reject(new Error('data not stringifiable', { cause: e }));
    }

    // Use sendBeacon if possible.
    try {
      const queued = NAV.sendBeacon(uri, data);
      return queued && Promise.resolve(queued)
        || Promise.reject(new Error('analytics not queued', {cause: response}));
    } catch {
      // Send data using the traditional fetch.
      try {
        const response = await fetch(uri, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          keepalive: true,
          credentials: 'include',
          mode: 'no-cors',
          body: data
        });

        return response.ok && Promise.resolve(response)
          || Promise.reject(new Error("Not 2xx response", {cause: response}));

      } catch (e) {
        return Promise.reject(new Error("Fetch did not work", {cause: e}));
      }
    }
  })
);
