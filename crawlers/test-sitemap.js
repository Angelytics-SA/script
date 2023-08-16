/**
 * How to test:
 * ------------
 * Open the console, go to the script folder (cd <path>/script)
 * Then type: node crawlers/test-sitemap.js
 *  
 */

(async url => {
  // Testing sitemap.
  const sitemap = await require('./getSitemap')(url);
  console.log('Sitemap', sitemap);
  console.log('# Results:', sitemap.length);
})('https://hoophouseusa.com'); // 'https://www.freshpaint.io/'