// NODE_ENV=PROD node bundle -i scripts/analytics/index.js -o scripts/analytics/test/bundled.js
(() => {
  const { WIN, NS, TAGS, SC, STO, STO_GE, STO_TBC, STO_WN, DOC, DC, IDK, P, LOADED } = require('./globals');
  const send = require('./send');
  const getMetadata = require('./getMetadata');
  let sendCustomEvent = () => {};
  const disableCookies = require('./disableCookies');
  const patch = require('./patch');
  const getChildNodes = require('./getChildNodes');
  // require('./preventScriptLoading')('other', null);
  require('./preventScriptLoading')();

  if (send) {
    const record = require('./record');
    const getWindowName = require('./getWindowName');
    const clickAttrOveride = require('./clickAttrOveride');
    const scrollAttrOveride = require('./scrollAttrOveride');
    const addUniqueIds = require('./addUniqueIds');
    const listenToFormStartAndSubmit = require('./listenToFormStartAndSubmit');
    const addEventListenerDomNodeInserted = require('./addEventListenerDomNodeInserted');
    sendCustomEvent = require('./sendCustomEvent');

    // Execute attr overide.
    const executeAttrOveride = (node = DOC.body, changedSet) => {
      let queue = [node], tn, i, cn, l;
      while (node = queue.pop()) {

        // Add children node to the queue.
        for (i = 0, cn = getChildNodes(node), l = cn.length; i !== l; ++i) queue.push(cn[i]);

        // Change node only if needed.
        if (changedSet && changedSet.has(node[IDK])) continue;

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

        // Register node if needed.
        changedSet && changedSet.add(node[IDK]);
      }
    }

    // On load event handler.
    const changed = new Set;
    const onload = () => {

      // Add unique ids.
      addUniqueIds();

      // Overide click events.
      executeAttrOveride(DOC.body, changed);

      // Listen to form.
      listenToFormStartAndSubmit();

      // Add listener for new nodes.
      addEventListenerDomNodeInserted(
        DOC.body,
        addUniqueIds,
        node => executeAttrOveride(node, changed),
        node => listenToFormStartAndSubmit(
          (node.tagName || '').toLowerCase() === 'form' && node
          || (node.getElementsByTagName && (node.getElementsByTagName('form') || []))
        )
      );

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

  // Overide addEventListener.
  require('./addEventListenerOveride');

  // Disable cookies if needed.
  DC && disableCookies();

  // Patch previous analytics if needed.
  P && patch();

  // Augment code inside window object.
  Object.defineProperty(WIN, NS, {
    value: Object.freeze({
      // To get metadata.
      getMetadata: getMetadata,
      // To send custom events.
      sendCustomEvent: sendCustomEvent,
      // To access the tags.
      TAGS: TAGS,
    }),
    configurable: false,
    writable: false,
    enumerable: false
  });

  // Remove script node from dom.
  SC && SC.remove();
})();