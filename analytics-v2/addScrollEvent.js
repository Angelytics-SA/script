const { WIN, DOC, TAGS } = require('./globals');
const record = require('./record');
const throttle = require('./throttle');

const HANDLERS = new Map,
p = (v, r) => Math.min(Math.max(Math.round(100 * v / r), 0), 100),

// Helper function to create an event handler.
createEventHandler = elmt => {
  let timeoutId = 0,
    xmin = Infinity,
    ymin = Infinity,
    xmax = 0,
    ymax = 0,
    xstart,
    ystart,
    x, y,
    body = DOC.body;

  // The record function.
  const f = () => {
    try {
      let w = Math.max((elmt.scrollWidth - (elmt === body && WIN.innerWidth || elmt.clientWidth))),
        h = Math.max((elmt.scrollHeight - (elmt === body && WIN.innerHeight || elmt.clientHeight))),
        o;

      // Get ranges.
      xmin !== xmax && ((o || (o = {})).horizontalScroll = { range: [p(xmin, w), p(xmax, w)], start: p(xstart, w), end: p(x, w) });
      ymin !== ymax && ((o || (o = {})).verticalScroll = { range: [p(ymin, h), p(ymax, h)], start: p(ystart, h), end: p(y, h) });
    
      // Record if needed, meaning if a scroll really happened.
      o && record({
        eventName: 'scroll',
        elmt,
        type: 'gesture',
        tags: [TAGS.design],
        extra: o
      });
    } catch {};

    // Reset params.
    xmin = ymin = Infinity;
    xmax = ymax = 0;
    xstart = ystart = undefined;
  };

  // Return event handler.
  return () => {
    try {
      elmt === body && (
        x = WIN.scrollX,
        y = WIN.scrollY
      ) || (
        x = elmt.scrollLeft,
        y = elmt.scrollTop
      );

      xstart === undefined && (
        xstart = x,
        ystart = y
      );

      xmin = Math.min(x, xmin);
      ymin = Math.min(y, ymin);
      xmax = Math.max(x, xmax);
      ymax = Math.max(y, ymax);
    } catch {};
    clearTimeout(timeoutId || 0);
    timeoutId = setTimeout(f, 500); // record only triggered if not scrolled after 500ms
  };
},

// The event handler, throttled.
eventHandler = throttle(({ target: elmt } = {}) => {
  if (!elmt) return;
  let handler = HANDLERS.get(elmt);
  handler || (HANDLERS.set(elmt, handler = createEventHandler(elmt)));
  handler();
}, 50); // trigger the handler only by intervals of 50ms

DOC.addEventListener('scroll', eventHandler, true);