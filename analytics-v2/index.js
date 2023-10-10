// NODE_ENV=PROD node utils/bundle -i scripts/analytics-v2/index.js -o scripts/analytics-v2/test/analytics.js
(() => {
  const { WIN, NS, TAGS, SC, STO, STO_GE, STO_TBC, STO_WN, DOC, DC, IDK, P, LOADED } = require('./globals');
  if (!LOADED) return;
  
  // Load ressources.
  const send = require('./send');
  const getMetadata = require('./getMetadata');
  let sendCustomEvent = () => {};

  if (send) {
    // Load ressources only if send is defined.
    const getWindowName = require('./getWindowName');
    const record = require('./record');
    sendCustomEvent = require('./sendCustomEvent');

    // Crashes and errors.
    if (STO) {
      const recordCrash = e => {
        record({
          eventName: 'code',
          error: typeof e === 'object' && e && {
            message: e.message,
            filename: e.filename,
            line: e.lineno,
            column: e.colno
          } || {
            message: e
          },
          type: 'error',
          tags: [TAGS.dev]
        });
      };

      // Record crashes.
      WIN.addEventListener('error', recordCrash);

      // Add beforeunload listener, for page crashes and end session.
      WIN.addEventListener(
        'beforeunload',
        () => {
          try {
            // For page crashes.
            STO.setItem(STO_GE, 'true');
          } catch (e) {
            // Record error.
            recordCrash(e);
          }

          // Record session end.
          record({
            eventName: 'end',
            elmt: DOC.body,
            type: 'session',
            tags: [TAGS.design, TAGS.sales]
          });
        }
      );

      // Unresponsive page.
      STO.getItem(STO_WN) === getWindowName()
        && STO.getItem(STO_GE) !== 'true'
        && record({
          eventName: 'crash',
          error: {
            message: 'Unresponsive code/page',
            timeBeforeCrash: STO.getItem(STO_TBC)
          },
          type: 'error',
          tags: [TAGS.dev]
        });

      // For page crash.
      try {
        STO.setItem(STO_GE, 'pending');
        setInterval(() => STO.setItem(STO_TBC, Date.now()), 1000);

        // To check if tab is duplicated.
        STO.setItem(STO_WN, getWindowName());
      } catch (e) {
        recordCrash(e);
      }
    }
    
    // After page load script.
    const onload = () => {
      // Record session start.
      record({
        eventName: 'start',
        elmt: DOC.body,
        type: 'session',
        tags: [TAGS.design, TAGS.sales]
      });

      // Remove the listener.
      WIN.removeEventListener('load', onload);
    }
    WIN.addEventListener('DOMContentLoaded', onload);

    // Add onclick event.
    require('./addClickEvent');

    // Add onscroll event.
    require('./addScrollEvent');

    // Add form event.
    require('./addFormEvent');
  }

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

  Object.defineProperty(WIN, '__has__angelitics__', {
    value: true,
    configurable: false,
    writable: false,
    enumerable: false
  });

  // Remove script node from dom.
  SC && SC.remove();
})();