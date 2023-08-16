const {
  Crawler,
  crawl,
  evalElmtProperty,
} = require('./core');
const Path = require('path');

// Helper function to add a url to the queue.
const addToQueue = (url, queue, visited) => {
  queue || (queue = []);
  visited || (visited = queue.visited || (queue.visited = new Set));
  (url = (url || '').toString()) && (
    visited.has(url)
    || visited.has(url + '/')
    || (queue.push(url), visited.add(url))
  );
  return queue;
}

// Sub-process. Takses care of different ways of crawling the website.
const subprocess = async (url, page, base) => {
  await page.goto(url);

  let res = [],
    i,
    l,
    v,
    r = await evalElmtProperty(page, 'a', 'href', true);

  // Get intra website links.
  for (i = 0, l = r.length; i !== l; ++i) {
    (v = (r[i] || '').trim()).startsWith(base)
      && !Path.extname((new URL(v = URL.getPageOrigin(v))).pathname || '')
      && res.push(v);
  }

  return res;
}

// Process function, assuming the crawler initialization, start and end will be tackled outside.
const process = async (url, crawler, map, base) => {
  // Init emap.
  map instanceof Map 
  || (map && (
    map = new Map((Array.isArray(map) || (map && [map]) || []).map(p => [p, []]))
  ))
  || (map = new Map);

  // Add urls.
  let queue = [], visited = new Set, pages = [], length;
  addToQueue(url, queue, visited);

  // Get domain name.
  addToQueue(base = new URL(url).origin, queue, visited);

  while (length = queue.length) {
    // Create new pages if needed.
    while(length > pages.length) pages.push(await crawler.createPage());

    // Get results.
    const results = await Promise.all(queue.map((u, i) => subprocess(u, pages[i], base)));

    for (let i = 0, l = results.length; i !== l; ++i) {
      const res = results[i], src = queue[i];

      // Add results.
      for (let j = 0, m = res.length, r, s; j !== m; ++j) {
        s = map.get(r = res[j]) || new Set;
        s.add(src);
        map.set(r, s);

        // Augment the queue if needed.
        addToQueue(r, queue, visited);
      }
    }

    // Remove already processed urls.
    queue = queue.slice(length);
  }

  // Close pages.
  await Promise.all(pages.map(p => p.close()))
  pages.length = 0;
  pages = null;

  return Array.from(map).map(([u, s]) => [u, Array.from(s || [])]);
}

/**
 * Generate website map. See https://www.browserstack.com/guide/puppeteer-proxy for proxies.
 * @param  {String}  url     The input url
 * @param  {Crawler} crawler The crawler to crawl the input url, optional
 * @return {Array}           The array of page urls
 */
const generateWebsiteMap = async (url, crawler) => {
  return await crawl(url, process, crawler);
}

// Exports.
generateWebsiteMap.process = process;
module.exports = generateWebsiteMap.generateWebsiteMap = generateWebsiteMap;