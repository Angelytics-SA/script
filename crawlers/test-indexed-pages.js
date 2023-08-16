/**
 * How to test:
 * ------------
 * Open the console, go to the script folder (cd <path>/script)
 * Then type: node crawlers/test-indexed-pages.js
 *  
 */

(async url => {
  // Testing indexed pages.
  const indexedPages = await require('./getIndexedPages')(url);
  console.log('Indexed pages', indexedPages.length, indexedPages);
})('https://hoophouseusa.com'); // 'https://www.freshpaint.io/'