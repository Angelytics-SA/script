const { WIN, DOC, DOC_EL, NAV, BRO, REN, WST, MOB, TS, LOC, TZO, SID, RES, UA, DEP, CA, C } = require('./globals');
const getElementMetadata = require('./getElementMetadata');
const getCookies = require('./getCookies');

// Helper function to get the metadata.
module.exports = elmt => {
  // Get basic data.
  let data = {}
  try {
    data = {
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
  } catch {}

  // Get page info.
  try {
    DOC.title && (data.page.title = DOC.title);
    DOC.referrer && (data.page.referrer = DOC.referrer.toString());
  } catch {};

  // Not supported by IE yet.
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    tz && (data.timeAndGeolocation.timeZone = tz);
  } catch {};

  // Get element metadata.
  try {
    const element = getElementMetadata(elmt);
    element && (data.element = element);
  } catch {}

  // Add cookies if needed.
  try {
    const cookies = getCookies(`${C && C + ';' || ''}${DOC.cookie}`);
    cookies && Object.keys(cookies).length && (data.cookies = cookies);
  } catch {}
  
  return data;
}