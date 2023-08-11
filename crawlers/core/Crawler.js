// Get headless browser.
const puppeteer = require('puppeteer');
const chalk = require('chalk');

/**
 * Simple wrapper class around puppeteer.
 * --------------------------------------
 * See https://www.browserstack.com/guide/puppeteer-proxy for proxies.
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
  #started;

  // Constructor.
  constructor(defaultParameters) {
    this.#defaultParameters = {
      headless: 'new',
      ...(defaultParameters || {})
    };
  }

  // Current page getter.
  get currentPage() { return this.#currentPage; }
  get started() { return this.#started; }

  // Start session.
  async start(parameters) {
    const {
      listenToCurrentPageConsole,
      ...params
    } = parameters || {};
    this.#browser = await puppeteer.launch({...this.#defaultParameters, ...params});
    this.#currentPage = await this.#browser.newPage();
    listenToCurrentPageConsole && await listenToPageConsole(this.#currentPage);
    this.#started = true;
    return this;
  }

  // Close a session.
  async end() {
    this.#browser && this.#browser.close && await this.#browser.close();
    this.#started = false;
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

  // Evaluate a function on a page.
  async evaluate(func = () => document, page = this.#currentPage) {
    let handle = await page.evaluateHandle(func), res;
    try {
      res = await handle.jsonValue();
    } catch (e) {
      console.error(new Error(e));
      res = null;
    }
    await handle.dispose();
    return res;
  }
}

// Helper function to make args accessible
const describe = jsHandle => (
  jsHandle.executionContext().evaluate(obj => `OBJ: ${typeof obj}, ${obj}`, jsHandle)
);

const colors = {
  LOG: chalk.grey, // (text: any) => text,
  ERR: chalk.red,
  WAR: chalk.yellow,
  INF: chalk.cyan,
};

// Helper function to listen to a console page.
const listenToPageConsole = async page => {

  // listen to browser console there
  page.on('console', async message => {
    const args = await Promise.all(message.args().map(arg => describe(arg)));
    // make ability to paint different console[types]
    const type = message.type().substr(0, 3).toUpperCase();
    const color = colors[type] || chalk.blue;
    let text = '';
    for (let i = 0; i < args.length; ++i) {
      text += `[${i}] ${args[i]} `;
    }
    console.log(color(`CONSOLE.${type}: ${message.text()}\n${text} `));
  });

  return page;
}

// Exports.
module.exports = Crawler.Crawler = Crawler;