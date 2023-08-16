/**
 * How to test:
 * ------------
 * Open the console, go to the script folder (cd <path>/script)
 * Then type: node crawlers/test-all.js
 *  
 */

const { process: generateWebsiteMap } = require('./generateWebsiteMap');
const { process: getSitemap } = require('./getSitemap');
const { process: getIndexedPages } = require('./getIndexedPages');
const { process: getAnalytics } = require('./getAnalytics');
const { Crawler } = require('./core');
const { getUrlStatus } = require('./getUrlStatus');

(async url => {
  // Init timer.
  console.time('Process time');

  // init the crawler.
  const crawler = new Crawler;

  // Start session.
  await crawler.start();

  // Testing website map generation, sitemap crawling and SERP.
  const [
    map,
    sitemap,
    indexedPages
  ] = await crawler.crawl(url, [
    generateWebsiteMap,
    getSitemap,
    getIndexedPages,
  ]);

  // Get unique urls.
  let urls = new Set;
  for (let i = 0, a = map, l = a.length; i !== l; ++i) urls.add(a[i][0]);
  for (let i = 0, a = sitemap, l = a.length; i !== l; ++i) urls.add(a[i][0]);
  for (let i = 0, a = indexedPages, l = a.length; i !== l; ++i) urls.add(a[i][0]);
  urls = Array.from(urls);

  // Get analytics.
  const analytics = await crawler.crawl(urls, getAnalytics);

  // End session.
  await crawler.end();

  // Get url status (does not need puppeter for that).
  let statuses = await getUrlStatus(urls),
    numValidUrls = statuses.reduce((p, [_, [ok, __]]) => p + ok, 0);
  statuses = new Map(statuses);


  console.log('# website mapped urls', map.length);
  console.log('# sitemap urls', sitemap.length);
  console.log('# indexed pages', indexedPages.length);
  console.log('urls', analytics.map((a, i) => {
    const [ok, code] = statuses.get(a[0]);
    return [...a, ok && 'valid' || `broken: ${code}`];
  }));
  console.log('# unique urls', urls.length);
  console.log('# unique valid urls', numValidUrls);

  // End timer.
  console.timeEnd('Process time');
})('https://hoophouseusa.com'); // 'https://www.freshpaint.io/'