const { DOC, NAV, BRO, REN, WST, MOB, TS, LOC, TZO, SID } = require('./globals');
const getElementBox = require('./getElementBox');

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
    location: LOC,
    date: Date.now(),
    timeZoneOffset: TZO,
    sessionId: SID,
    title: DOC.title
  };
  DOC.referrer && (data.referrer = DOC.referrer.toString());

  // Not supported by IE yet.
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    tz && (data.timeZone = tz);
  } catch {};

  if (elmt instanceof Node && typeof elmt.getAttribute === 'function') {
    let el = data.element = getElementBox(elmt), i,
      id = elmt.getAttribute('id') || elmt.id
        || elmt.getAttribute('name') || elmt.name
        || elmt.getAttribute('label') || elmt.label
        || elmt.getAttribute('alt') || elmt.alt
        || ((i = elmt.getAttribute('for') || elmt.for) && `label for ${i}`),
      src = elmt.getAttribute('src') || elmt.src
        || elmt.getAttribute('href') || elmt.href
        || elmt.getAttribute('action') || elmt.action,
      type = elmt.getAttribute('type') || elmt.type;
    id && (el.identifier = id);
    src && (el.source = src);
    el.tagName = elmt.tagName.toLowerCase();
    type && (el.type = elmt.type);
  }
  return data;
}