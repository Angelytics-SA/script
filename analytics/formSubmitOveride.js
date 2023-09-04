const { TAGS } = require('./globals');
const record = require('./record');

(() => {
  const submit = HTMLFormElement.prototype.submit;
  // Record a form submit, but not the content of it.
  try {
    Object.defineProperty(HTMLFormElement.prototype, 'submit', {
      value: function(...args) {
        record({
          eventName: 'submit',
          elmt: this,
          type: 'data',
          tags: [TAGS.design, TAGS.sales]
        });
        submit.apply(this, args);
      }
    });
  } catch {};
})();     