// node crawlers/test.js

(async url => {
  // Testinf google indexed pages
  console.log('Google indexed pages', await require('./getIndexedPages')(url));
})('https://hoophouseusa.com');