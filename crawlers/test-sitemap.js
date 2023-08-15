/**
 * How to test:
 * ------------
 * Open the console, go to the script folder (cd <path>/script)
 * Then type: node crawlers/test-sitemap.js
 *  
 */

(async url => {
  // Testinf indexed pages.
  const sitemap = await require('./getSitemap')(url);
  console.log('Sitemap', sitemap.length, sitemap);
})('https://hoophouseusa.com'); // 'https://www.freshpaint.io/'