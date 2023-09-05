const { DOC, NAV, BRO, REN, WST, MOB, TS, LOC, TZO, SID, IDK } = require('./globals');
const getElementMetadata = require('./getElementMetadata');

// Helper function to get the metadata.
module.exports = elmt => {
  const data = {
    platform: {
      browser: BRO,
      renderingEngine: REN,
      windowSizeType: WST,
      isMobile: MOB,
      hasTouchScreen: TS,
      language: NAV.language
    },
    page: {
      location: LOC
    },
    date: Date.now(),
    timeZoneOffset: TZO,
    sessionId: SID
  };
  DOC.title && (data.page.title = DOC.title);
  DOC.referrer && (data.page.referrer = DOC.referrer.toString());

  // Not supported by IE yet.
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    tz && (data.timeZone = tz);
  } catch {};

  // Get element metadata.
  const element = getElementMetadata(elmt);
  element && (data.element = element);
  
  return data;
}