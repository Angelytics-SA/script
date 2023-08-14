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
  get started() { return this.#started; }

  // Start session.
  async start(parameters) {
    this.#browser = await puppeteer.launch({...this.#defaultParameters, ...(parameters || {})});
    this.#started = true;
    return this;
  }

  // Close a session.
  async end() {
    this.#browser && this.#browser.close && await this.#browser.close();
    this.#started = false;
    return this;
  }

  // Evaluate a function on a page.
  async evaluate(...args) {
    return await evaluate(...args);
  }

  // Evaluate a function on a page.
  async createPage(showPageConsole = false) {
    const page = await this.#browser.newPage(), goto = page.goto;
    page.goto = async function(url, ...args) {
      url instanceof URL && (url = url.toString());
      return goto.apply(page, [url, ...args]);
    }
    showPageConsole && await listenToPageConsole(page);
    return page;
  }
}

// Default evaluate function.
const evaluateDefaultFunc = () => document;

// Helper function to evaluate a page.
const evaluate = async (func = evaluateDefaultFunc, page) => {
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
Crawler.evaluate = evaluate;
module.exports = Crawler.Crawler = Crawler;