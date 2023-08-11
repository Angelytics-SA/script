const { Crawler } = require('./core');

const crawler = new Crawler();

const googleSearch = async url => {
  // Get the domain name.
  url = URL.domain(url);

  await crawler.start();
  await crawler.goto(url);
  const content = await crawler.getContent(), dom = content.toNode();
  // console.log('content', dom, dom.childNodes, stringify(dom));
  await crawler.end();
}