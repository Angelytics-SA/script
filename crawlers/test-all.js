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
const { crawl } = require('./core');

(async url => {
  // Testing website map generation, sitemap crawling and SERP.
  const [
    map,
    sitemap,
    indexedPages
  ] = await crawl(url, [
    generateWebsiteMap,
    getSitemap,
    getIndexedPages,
  ]);
  console.log('# website mapped urls', map.length);
  console.log('# sitemap urls', sitemap.length);
  console.log('# indexed pages', indexedPages.length);
})('https://hoophouseusa.com'); // 'https://www.freshpaint.io/'