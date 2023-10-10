const { DOC, TAGS } = require('./globals');
const record = require('./record');

// Hlper function to create a click , mousedown, etc handler.
const createEventHandler = gesture => ({ target: elmt } = {}) => {
  let tn;
  elmt
    && (tn = (elmt.tagName || '').toLowerCase()) !== 'form'
    && tn !== 'input'
    && tn !== 'textarea'
    && record({
      eventName: gesture,
      elmt,
      tags: [TAGS.design, TAGS.sales],
      type: 'gesture'
    });
}

// Helper function to register the gesture.
const registerGesture = (gesture, elmt = DOC, capture = false) => {
  elmt.addEventListener(gesture, createEventHandler(gesture), capture);
}

// Register gestures.
registerGesture('click');