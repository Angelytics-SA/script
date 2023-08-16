const {
  Crawler,
  crawl,
  evaluate
} = require('./core');

// Helper function to evaluate analytics on a page.
const evalAnalytics = () => {
  let output = [],
    getCookies = (s = document.cookie) => (s || '').split(/\s+;\s+|;\s+|\s+;|;/g).map(s => (s || '').split(/\s+=\s+|\s+=|=\s+|=/)),
    cookies = getCookies(),
    i = 0,
    l = cookies.length,
    hasGA = window.ga,
    hasPixel = window.fbq;
  
  for (; i !== l && !hasGA; ++i) {
    const [k = '', _] = cookies[i] || [];
    k.startsWith('_ga') && (hasGA = true);
  }
  
  hasGA && output.push('ga');
  hasPixel && output.push('pixel');

  return output;
}

// Helper function to get the analytics on one page.
const gatherAnalytics = async (url, page) => {
  let pageCreated, results;

  // In case no page is created yet, let the crawler do it.
  page instanceof Crawler && (pageCreated = true, page = await page.createPage());

  // Get all the document analytics.
  await page.goto(url);
  results = await evaluate(page, evalAnalytics);

  // Close page.
  pageCreated && (await page.close(), page = null);

  return results;
}

// Process function, assuming the crawler initialization, start and end will be tackled outside.
const process = async (url, crawler, analytics) => {
  // Init indexed pages.
  analytics instanceof Set 
  || (analytics && (
    analytics = new Set(Array.isArray(analytics) || (analytics && [analytics]) || [])
  ))
  || (analytics = new Set);
  
  // Get analytics.
  const results = await gatherAnalytics(url, crawler);
  for (let i = 0, l = results.length; i !== l; ++i) analytics.add(results[i]);

  return [url, Array.from(analytics)];
}

/**
 * Get analytics. See https://www.browserstack.com/guide/puppeteer-proxy for proxies.
 * @param  {String}  url     The input url
 * @param  {Crawler} crawler The crawler to crawl the input url, optional
 * @return {Array}           The array of urls and their analytic engines
 */
const getAnalytics = async (url, crawler) => {
  return await crawl(url, process, crawler);
}

// Exports.
getAnalytics.process = process;
module.exports = getAnalytics.getAnalytics = getAnalytics;