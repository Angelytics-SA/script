/**
 * How to test:
 * ------------
 * Open the console, go to the script folder (cd <path>/script)
 * Then type: node crawlers/test-url-status.js
 *  
 */

(async (...urls) => {
  // Testing sitemap.
  const statuses = await require('./getUrlStatus')(urls);
  console.log('Statuses', statuses);
  console.log('# Results:', statuses.length);
})('https://hoophouseusa.com/category/cannabis/'); // 'https://www.freshpaint.io/'