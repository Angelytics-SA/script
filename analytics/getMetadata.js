const { WIN, DOC, DOC_EL, NAV, BRO, REN, WST, MOB, TS, LOC, TZO, SID, RES, UA, DEP, CA } = require('./globals');
const getElementMetadata = require('./getElementMetadata');

// Helper function to get the metadata.
module.exports = elmt => {
  const data = {
    platform: {
      browser: BRO,
      userAgent: UA,
      renderingEngine: REN,
      sessionStartWindowSizeType: WST,
      sessionStartScreenResolution: RES,
      currentScreenResolution: {
        width: WIN.innerWidth || DOC_EL.clientWidth || DOC.body.clientWidth,
        height: WIN.innerHeight || DOC_EL.clientHeight || DOC.body.clientHeight,
      },
      mobileType: MOB,
      hasTouchScreen: TS,
      language: NAV.language,
      cookieEnabled: CA,
      deprecated: DEP
    },
    page: {
      location: LOC
    },
    timeAndGeolocation: {
      date: Date.now(),
      timeZoneOffset: TZO,
    },
    ids: {
      session: SID
    }
  };
  DOC.title && (data.page.title = DOC.title);
  DOC.referrer && (data.page.referrer = DOC.referrer.toString());

  // Not supported by IE yet.
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    tz && (data.timeAndGeolocation.timeZone = tz);
  } catch {};

  // Get element metadata.
  const element = getElementMetadata(elmt);
  element && (data.element = element);
  
  return data;
}