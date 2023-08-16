/**
 * How to test:
 * ------------
 * Open the console, go to the script folder (cd <path>/script)
 * Then type: node crawlers/test-analytics.js
 *  
 */

(async url => {
  // Testing sitemap.
  const analytics = await require('./getAnalytics')(url);
  console.log('Analytics', analytics);
})('https://hoophouseusa.com'); // 'https://www.freshpaint.io/'