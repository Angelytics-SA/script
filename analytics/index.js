// NODE_ENV=PROD node bundle -i scripts/analytics/index.js -o scripts/analytics/test/bundled.js
(() => {
  const { WIN, NS, TAGS, SC, STO, STO_GE, STO_TBC, STO_WN, DOC } = require('./globals');
  const send = require('./send');
  const getMetadata = require('./getMetadata');
  let sendCustomEvent = () => {};

  if (send) {
    const record = require('./record');
    const getWindowName = require('./getWindowName');
    const clickAttrOveride = require('./clickAttrOveride');
    const scrollAttrOveride = require('./scrollAttrOveride');
    const addUniqueIds = require('./addUniqueIds');
    sendCustomEvent = require('./sendCustomEvent');

    // Execute attr overide.
    const executeAttrOveride = (node = DOC.body, changedSet) => {
      let queue = [node], tn, i, cn, l;
      while (node = queue.pop()) {

        // Add children node to the queue.
        for (i = 0, cn = node.childNodes || [], l = cn.length; i !== l; ++i) queue.push(cn[i]);

        // Change node only if needed.
        if (changedSet && changedSet.has(node)) continue;

        // Check if node is attached an onclick attribute.
        tn = (node.tagName || '').toLowerCase();
        if (tn && tn !== 'script' && tn !== 'br') {
          clickAttrOveride(node, 'onclick');
          clickAttrOveride(node, 'onmouseup');
          clickAttrOveride(node, 'onmousedown');
          clickAttrOveride(node, 'ontouchstart');
          clickAttrOveride(node, 'ontouchend');
          scrollAttrOveride(node);
        }

        changedSet && changedSet.add(node);
      }
    }

    // On load event handler.
    const changed = new Set;
    const onload = () => {
      executeAttrOveride(DOC.body, changed);

      // Add unique ids.
      addUniqueIds();

      // Page crash.
      if (STO) {
        STO.setItem(STO_GE, 'pending');
        setInterval(() => STO.setItem(STO_TBC, Date.now()), 1000);

        // To check if tab is duplicated.
        STO.setItem(STO_WN, getWindowName());
      }

      // Record session start.
      record({
        eventName: 'start',
        elmt: document.body,
        type: 'session',
        tags: [TAGS.design, TAGS.sales]
      });

      // Remove the listener.
      WIN.removeEventListener('load', onload);
    }

    // Add load listener.
    // WIN.addEventListener('load', onload);
    WIN.addEventListener('DOMContentLoaded', onload);

    // Add beforeunload listener, for page crashes and end session.
    STO && WIN.addEventListener(
      'beforeunload',
      () => {
        // For page crashes.
        STO.setItem(STO_GE, 'true');

        // Record session end.
        record({
          eventName: 'end',
          elmt: DOC.body,
          type: 'session',
          tags: [TAGS.design, TAGS.sales]
        });
      }
    );

    // Record crashes.
    WIN.addEventListener('error', e => {
      record({
        eventName: 'code',
        error: {
          message: e.message,
          filename: e.filename,
          line: e.lineno,
          column: e.colno
        },
        type: 'error',
        tags: [TAGS.dev]
      });
    });

    if (STO && STO.getItem(STO_WN) === getWindowName() && STO.getItem(STO_GE) !== 'true') {
      record({
        eventName: 'crash',
        error: {
          message: 'Unresponsive code/page',
          timeBeforeCrash: STO.getItem(STO_TBC)
        },
        type: 'error',
        tags: [TAGS.dev]
      });
    }
  }

  // Overide form submit.
  require('./formSubmitOveride');

  // Overide addEventListener.
  require('./addEventListenerOveride');

  // Augment code inside window object.
  WIN[NS] = {
    // To get metadata.
    getMetadata: getMetadata,
    // To send custom events.
    sendCustomEvent: sendCustomEvent,
    // To access the tags.
    TAGS: TAGS
  };

  // Remove script node from dom.
  SC && SC.remove();
})();