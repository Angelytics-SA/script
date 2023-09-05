const { IDK } = require('./globals');
const getElementBox = require('./getElementBox');

// Helper function to get the metadata.
module.exports = (elmt, data) => {
  if (elmt instanceof Node && typeof elmt.getAttribute === 'function') {
    data = getElementBox(elmt);
    let i,
      id = elmt.getAttribute('id') || elmt.id
        || elmt.getAttribute('name') || elmt.name
        || elmt.getAttribute('label') || elmt.label
        || elmt.getAttribute('alt') || elmt.alt
        || ((i = elmt.getAttribute('for') || elmt.for) && `label for ${i}`)
        || elmt.getAttribute(IDK) || elmt[IDK],
      src = elmt.getAttribute('src') || elmt.src
        || elmt.getAttribute('href') || elmt.href
        || elmt.getAttribute('action') || elmt.action,
      tn = (elmt.tagName || '').toLowerCase(),
      type = elmt.getAttribute('type') || elmt.type;
    id && (data.identifier = id);
    src && (data.source = src);
    tn && (data.tagName = tn);
    type && (data.type = type);
  }
  return data;
}