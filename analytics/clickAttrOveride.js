const { TAGS } = require('./globals');
const attrOveride = require('./attrOveride');
const record = require('./record');

// Overide direct gesture event functions.
module.exports = (node, prop) => attrOveride(
  node,
  prop,
  () => record({
    eventName: prop.toLowerCase().slice(2),
    elmt: node,
    tags: [TAGS.design, TAGS.sales],
    type: 'gesture'
  })
);