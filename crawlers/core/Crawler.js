// Get headless browser.
const puppeteer = require('puppeteer');

/**
 * Simple wrapper class around puppeteer.
 * 
 * Example:
 * -------
 * const crawler = new Crawler();
 * (async url => {
 *   await crawler.start();
 *   await crawler.goto(url);
 *   const content = await crawler.getContent();
 *   await crawler.end();
 *   console.log('CONTENT', content);
 * })('https://www.google.com/search?q=site:https://hoophouseusa.com&num=100&start=50');
 */
class Crawler {
  // Private members.
  #browser;
  #currentPage;
  #defaultParameters;

  // Constructor.
  constructor(defaultParameters) {
    this.#defaultParameters = {
      headless: 'new',
      ...(defaultParameters || {})
    };
  }

  // Current page getter.
  get currentPage() { return this.#currentPage; }

  // Start session.
  async start(parameters) {
    this.#browser = await puppeteer.launch({...this.#defaultParameters, ...(parameters || {})});
    this.#currentPage = await this.#browser.newPage();
    return this;
  }

  // Close a session.
  async end() {
    this.#browser && this.#browser.close && await this.#browser.close();
    return this;
  }

  // Go to a specify url.
  async goto(url, ...args) {
    url instanceof URL && (url = url.toString());
    await this.#currentPage.goto(url, ...args);
    return this;
  }

  // Get the whole html, stringified.
  async getContent(page = this.#currentPage) {
    return await page.content();
  }
}

// Exports.
module.exports = Crawler.Crawler = Crawler;