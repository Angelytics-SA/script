/**
 * How to test:
 * ------------
 * Open the console, go to the script folder (cd <path>/script)
 * Then type: node crawlers/test-generate-website-map.js
 *  
 */

(async url => {
  // Testing website map generation.
  const map = await require('./generateWebsiteMap')(url);
  console.log('Website map', map);
  console.log('# Results:', map.length);
})('https://hoophouseusa.com'); // 'https://www.freshpaint.io/'