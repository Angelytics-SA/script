const { TAGS } = require('./globals');
const record = require('./record');

(() => {
  const addEventListener = EventTarget.prototype.addEventListener;

  // Method overloading to capture events.
  try {
    Object.defineProperty(EventTarget.prototype, 'addEventListener', {
      value: function (type, func, ...args) {
        return addEventListener.apply(this, [
          type,
          ((type = type.toLowerCase()) === 'click'
            || type === 'touchstart'
            || type === 'touchend'
            || type === 'mouseup'
            || type === 'mousedown') && function (...v) {
              record({
                eventName: type,
                elmt: this,
                type: 'gesture',
                tags: [TAGS.design]
              });
              return typeof func === 'function' && func(...v);
            } || func,
          ...args
        ]);
      }
    });
  } catch {};
})();