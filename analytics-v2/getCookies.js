const { DOC } = require('./globals');

// Helper functions.
const CRe1 = /\s+;\s+|;\s+|\s+;|;/g,
  CRe2 = /\s+=\s+|\s+=|=\s+|=/,
  f = x => x, // filter out non valid results
  m = s => { // map key-value pair, if both the key and the value are valid
    const [k = '', v = ''] = (s || '').split(CRe2);
    return k && v && [k, v];
  },
  r = (c, [k, v]) => { // reduce the map to an object, allowing multiple values for the same key
    const a = (c || (c = {}))[k];
    a && (Array.isArray(a) && a.push(v) || (c[k] = [a, v]))
    || (c[k] = v);
    return c;
  },
  q = c => { // guaranty that the multiple values for the same key are unique
    if (c) {
      for (const k in c) {
        let v = c[k];
        Array.isArray(v) && (
          c[k] = v = Array.from(new Set(v)),
          v.length === 1 && (c[k] = v[0])
        );
      }
    }
    return c;
  };

// Exports.
module.exports = (
  cookies, s = cookies && (cookies.cookie || cookies) || DOC.cookie || ''
) => {
  try {
    return q(s.split(CRe1).map(m).filter(f).reduce(r, null));
  }
  catch {
    return null;
  }
}