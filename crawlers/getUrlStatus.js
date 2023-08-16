// Helper function to get a url status.
const getStatus = async url => {
  url instanceof URL && (url = url.toString());
  const response = await fetch(url);
  return [url, [response.ok, response.status]];
}

/**
 * Get urls status. See https://www.browserstack.com/guide/puppeteer-proxy for proxies.
 * @param  {String}  url     The input url
 * @return {Array}           The array of urls with their status and code
 */
const getUrlStatus = async (...urls) => await Promise.all(urls.flat(Infinity).map(u => getStatus(u)));

// Exports.
module.exports = getUrlStatus.getUrlStatus = getUrlStatus;