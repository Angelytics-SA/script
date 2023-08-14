const { Crawler, evaluate } = require('./core');

// Default crawler.
let CRAWLER;

// Build a Google search query.
// num = 10,20,30,40,50,100.
const getGoogleSearchQuery = (url, num = 100, start = 0) => (
  `https://www.google.com/search?q=site:${url}&num=${num}&start=${start}`
);

// Build a Bing search query.
// num = 1-100.
const getBingSearchQuery = (url, num = 100, start = 0) => (
  `https://www.bing.com/search?q=site:${url}&count=${num}&first=${start}&answerCount=${num}&offset=${start}`
);

// Build a Yahoo search query.
// num = 1-100.
const getYahooSearchQuery = (url, num = 100, start = 0) => (
  `https://search.yahoo.com/search?p=site:${url}&n=${num}&b=${start}`
);

// For Bing, the parameter is count=## where ## can be anything from 1-100.
// For Yahoo, the parameter is n=## where ## can be anything from 1-100.

// Crawl search.
const crawlSearch = async (
  url,
  page,
  getSearchQueryFunc = getGoogleSearchQuery
) => {
  let query,
    num = 10,
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
    l,
    r,
    output = new Set;

  page instanceof Crawler && (page = await page.createPage());

  while (found) {
    // Form the query.
    query = getSearchQueryFunc(url, num, start);

    // Get all the document anchors.
    await page.goto(query);
    results = await evaluate(getAnchors, page) || [];

    // Filter out anchors that don't start with the url.
    found = output.size;
    for (i = 0, l = results.length; i !== l; ++i) {
      (r = (results[i] || '').trim()).startsWith(url) && output.add(r);
    }
    found = output.size - found;

    // Next page.
    start += num;
  }

  return Array.from(output);
}

const searchEngines = [
  ['google', getGoogleSearchQuery],
  ['bing', getBingSearchQuery],
  ['yahoo', getYahooSearchQuery]
];

// Process function, assuming the crawler initialization, start and end will be tackled outside.
const process = async (url, crawler, indexedPages) => {
  // Init indexed pages.
  indexedPages instanceof Map 
  || (indexedPages && (
    indexedPages = new Map((Array.isArray(indexedPages) && indexedPages || [indexedPages]).map(p => [p, []]))
  ))
  || (indexedPages = new Map);

  // Add original url.
  let p = indexedPages.get(url = URL.getPageOrigin(url)) || [];
  indexedPages.set(url, p);

  // Get the domain name.
  p = indexedPages.get(url = new URL(url).origin) || [];
  indexedPages.set(url, p);

  // Search in paralel.
  const results = await Promise.all(searchEngines.map(([_, queryFunc]) => (
    crawlSearch(url, crawler, queryFunc)
  )));
  for (let i = 0, l = results.length, j, m, r, e; i !== l; ++i) {
    e = searchEngines[i][0];
    for (j = 0, r = results[i], m = r.length; j !== m; ++j) {
      p = indexedPages.get(url = URL.getPageOrigin(r[j])) || [];
      p.push(e);
      indexedPages.set(url, p);
    }
  }

  // A little bit of pruning.
  indexedPages.forEach((v, u) => {
    p = indexedPages.get(u + '/');
    if (p) {
      indexedPages.set(u + '/', Array.from(new Set([...p, ...(v || [])])));
      indexedPages.delete(u);
    }
  });

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