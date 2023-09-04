const { DOC } = require('./globals');
const getCookies = require('./getCookies');

const Cd = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
  Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');

module.exports = (doc = DOC, C = getCookies(doc)) => {
  // Disable cookies.
  for (let i = 0, l = C.length; i !== l; ++i) {
    const [k, _] = C[i] || [];
    k && (doc.cookie = `${k}=; expires=${new Date(Date.now() - 120000).toUTCString()}; max-age=-99999999`);
  }

  // Prevent the creation of new cookie.
  if (Cd && Cd.configurable) {
    Object.defineProperty(doc, 'cookie', {
      get: function () {
        return Cd.get.call(doc);
      },
      set: function (val) {
        // Does nothing but returning the value.
        return val;
      }
    });
  }
}