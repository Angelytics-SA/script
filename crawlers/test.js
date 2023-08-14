// node crawlers/test.js

(async url => {
  // Testinf indexed pages.
  const indexedPages = await require('./getIndexedPages')(url);
  console.log('Indexed pages', indexedPages.length, indexedPages);
})('https://hoophouseusa.com');