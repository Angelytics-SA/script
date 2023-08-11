const { Crawler } = require('./core');

// Default crawler.
let CRAWLER;

// Build a Google search query.
// num = 10,20,30,40,50,100.
const getGoogleSearchQuery = (url, num = 100, start = 0) => (
  `https://www.google.com/search?q=site:${url}&num=${num}&start=${start}`
);

// Crawl google search.
const crawlGoogleSearch = async (url, crawler, output = []) => {
  output || (output = []);
  let query,
    num = 100,
    start = 0,
    results,
    found = true,
    getAnchors = () => {
      let anchors = document.querySelectorAll('a'),
        i = 0,
        l = anchors.length,
        output = new Array(l);
      for (; i !== l; ++i) output[i] = anchors[i].href;
      return output;
    },
    i,
    l;

  while (found) {
    // Form the query.
    query = getGoogleSearchQuery(url, num, start);

    // Get all the document anchors.
    await crawler.goto(query);
    results = await crawler.evaluate(getAnchors) || [];

    // Filter out anchors that don't start with the url.
    found = false;
    for (i = 0, l = results.length; i !== l; ++i) {
      (results[i] || '').trim().startsWith(url) && (output.push(results[i]), found = true);
    }

    // Next page.
    start += num;
  }

  return output;
}

// Process function, assuming the crawler initialization, start and end will be tackled outside.
const process = async (url, crawler, indexedPages) => {
  // Init indexed pages.
  indexedPages instanceof Set 
  || (indexedPages && (
    indexedPages = new Set(Array.isArray(indexedPages) && indexedPages || [indexedPages])
  ))
  || (indexedPages = new Set);

  // Add original url.
  indexedPages.add(URL.getPageOrigin(url));

  // Get the domain name.
  url = (url instanceof URL && url || new URL(url)).origin;
  indexedPages.add(url);

  // Google search.
  for (let i = 0, r = await crawlGoogleSearch(url, crawler), l = r.length; i !== l; ++i) {
    indexedPages.add(URL.getPageOrigin(r[i]));
  }

  // A little bit of pruning.
  indexedPages.forEach(u => indexedPages.has(u + '/') && indexedPages.delete(u));

  return Array.from(indexedPages);
}

/**
 * Get indexed pages. See https://www.browserstack.com/guide/puppeteer-proxy for proxies.
 * @param  {String}  url     The input url
 * @param  {Crawler} crawler The crawler to crawl the input url, optional
 * @return {Array}           The array of indexed page urls
 */
const getIndexedPages = async (url, crawler = CRAWLER || (CRAWLER = new Crawler()), started) => {
  // Init the crawler if needed
  crawler || (crawler = new Crawler());
  (started = crawler.started) || await crawler.start();
  
  // Get the indexed pages.
  const indexedPages = await process(url, crawler);
  
  // Close the crawler if need.
  started || await crawler.end();

  return indexedPages;
}

// Exports.
getIndexedPages.process = process;
module.exports = getIndexedPages.getIndexedPages = getIndexedPages;