const {
  Crawler,
  crawl,
  evalElmtProperty,
  evaluate
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

// Helper function to parse embeded stringified xml in a page.
const getXml = () => {
  let node = document.body,
    queue = node && [node] || [],
    parser = new DOMParser,
    i, l, c, n, j , m, r,
    output = [];
  while (node = queue.pop()) {
    // Try to parse a node content into an xml.
    try {
      // Get the <loc>...</loc> content.
      n = ((n = node.textContent) && parser.parseFromString(n, 'text/xml')).querySelectorAll('loc') || [];
      for (j = 0, m = n.length; j !== m; ++j) {
        (r = (n[j].textContent || '').trim()) && output.push(r);
      }
    } catch {}

    // Add child nodes to the list, to continue the traversial.
    for (i = 0, c = node.childNodes || [], l = c.length; i !== l; ++i) {
      queue.push(c[i]);
    }
  }

  return output;
}

// Sub-process. Takses care of different ways of parsing sitemap and sub-sitemaps.
const subprocess = async (url, page, base) => {
  await page.goto(url);
  let res = [],
    toBeAdded = [],
    i,
    l,
    v,
    r = (await Promise.all([ // Get sitemap
      evalElmtProperty(page, 'a', 'href', true), // sitemaps that have anchors
      evalElmtProperty(page, 'loc', 'textContent', true), // sitemaps that are xml
      evaluate(page, getXml) // sitemaps that have embeded stringified xml inside html
    ])).reduce((prev, cur) => { // flaten result into one array.
      for (i = 0, l = cur.length; i !== l; ++i) prev.push(cur[i]);
      return prev;
    }, []);

  // Dissociate from sub sitemaps (.xml) and sitemap.
  for (i = 0, l = r.length; i !== l; ++i) {
    Path.extname(v = r[i] || '').toLowerCase() === '.xml' && toBeAdded.push(v)
      || (v.startsWith(base) && res.push(v));
  }

  return [res, toBeAdded];
}

// Process function, assuming the crawler initialization, start and end will be tackled outside.
const process = async (url, crawler, sitemap, base) => {
  // Init sitemap.
  sitemap instanceof Map 
  || (sitemap && (
    sitemap = new Map((Array.isArray(sitemap) && sitemap || [sitemap]).map(p => [p, []]))
  ))
  || (sitemap = new Map);

  // Add url.
  Path.extname(url = url.toString()).toLowerCase() === '.xml'
    || (url = Path.join(url, 'sitemap.xml'));
  let queue = [], visited = new Set, pages = [], length;
  addToQueue(url, queue, visited);

  // Get domain name.
  addToQueue(Path.join(base = new URL(url).origin, 'sitemap.xml'), queue, visited);

  while (length = queue.length) {
    // Create new pages if needed.
    while(length > pages.length) pages.push(await crawler.createPage());

    // Get results.
    const results = await Promise.all(queue.map((u, i) => subprocess(u, pages[i], base)));

    for (let i = 0, l = results.length; i !== l; ++i) {
      const [res = [], toBeAdded = []] = results[i], src = queue[i];

      // Add results.
      for (let j = 0, m = res.length, r, s; j !== m; ++j) {
        s = sitemap.get(r = URL.getPageOrigin((res[j] || '').trim())) || new Set;
        s.add(src);
        sitemap.set(r, s);
      }

      // Augment the queue if needed.
      for (let j = 0, m = toBeAdded.length; j !== m; ++j)
        addToQueue(toBeAdded[j], queue, visited);
    }

    queue = queue.slice(length);
  }

  return Array.from(sitemap).map(([u, s]) => [u, Array.from(s || [])]);
}

/**
 * Get indexed pages. See https://www.browserstack.com/guide/puppeteer-proxy for proxies.
 * @param  {String}  url     The input url
 * @param  {Crawler} crawler The crawler to crawl the input url, optional
 * @return {Array}           The array of indexed page urls
 */
const getSitemap = async (url, crawler) => {
  return await crawl(url, process, crawler);
}

// Exports.
getSitemap.process = process;
module.exports = getSitemap.getSitemap = getSitemap;