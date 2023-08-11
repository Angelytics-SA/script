const Crawler = require('./Crawler');
const Utils = require('./utils');

// Exports.
for (const k in Utils) Crawler[k] = Utils[k];
module.exports = Crawler.Crawler = Crawler;