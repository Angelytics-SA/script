const { WIN, TAGS } = require('./globals');
const attrOveride = require('./attrOveride');
const throttle = require('./throttle');
const record = require('./record');

// Helper function to check if a node can scroll.
const canScroll = (node, scrollAxis) => {
  if (node[scrollAxis] === 0) {
    node[scrollAxis] = 1;
    if (node[scrollAxis] === 1) {
      node[scrollAxis] = 0;
      return true;
    }
  } else return true;
  return false;
};

module.exports = node => (
  (
    (
      node.scrollHeight > node.clientHeight
      || (node === document.body && node.clientHeight > WIN.innerHeight)
      || canScroll(node, 'scrollTop')
    )
    && WIN.getComputedStyle(node).overflowY.indexOf('hidden') === -1
  ) || (
    (
      node.scrollWidth > node.clientWidth
      || (node === document.body && node.clientWidth > WIN.innerWidth)
      || canScroll(node, 'scrollLeft')
    )
    && WIN.getComputedStyle(node).overflowX.indexOf('hidden') === -1
  )
) && attrOveride(node, 'onscroll', ((
  timeoutId = 0,
  xmin = Infinity,
  ymin = Infinity,
  xmax = 0,
  ymax = 0,
  xstart,
  ystart,
  x, y,
  p = (v, r) => Math.min(Math.max(Math.round(100 * v / r), 0), 100),
  f = () => {
    let w = Math.max((node.scrollWidth - (node === document.body && WIN.innerWidth || node.clientWidth))),
      h = Math.max((node.scrollHeight - (node === document.body && WIN.innerHeight || node.clientHeight))),
      o;
    xmin !== xmax && ((o || (o = {})).horizontalScroll = { range: [p(xmin, w), p(xmax, w)], start: p(xstart, w), end: p(x, w) });
    ymin !== ymax && ((o || (o = {})).verticalScroll = { range: [p(ymin, h), p(ymax, h)], start: p(ystart, h), end: p(y, h) });
    o && record({
      eventName: 'scroll',
      elmt: node,
      type: 'gesture',
      tags: [TAGS.design],
      extra: o
    });
    xmin = ymin = Infinity;
    xmax = ymax = 0;
    xstart = ystart = undefined;
  }
) => throttle(() => {
  if (node === document.body) {
    x = WIN.scrollX;
    y = WIN.scrollY;
  } else {
    x = node.scrollLeft;
    y = node.scrollTop;
  }
  if (xstart === undefined) {
    xstart = x;
    ystart = y;
  }
  xmin = Math.min(x, xmin);
  ymin = Math.min(y, ymin);
  xmax = Math.max(x, xmax);
  ymax = Math.max(y, ymax);
  clearTimeout(timeoutId);
  timeoutId = setTimeout(f, 500); // f only triggered if not scrolled after 500ms
}, 50)
)(), true);