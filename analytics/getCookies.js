const { DOC } = require('./globals');

const CRe1 = /\s+;\s+|;\s+|\s+;|;/g,
  CRe2 = /\s+=\s+|\s+=|=\s+|=/,
  f = x => x,
  m = s => {
    const [k = '', v = ''] = (s || '').split(CRe2);
    return k && v && [k, v];
  },
  r = (c, [k, v]) => {
    const a = (c || (c = {}))[k];
    a && (Array.isArray(a) && a.push(v) || (c[k] = [a, v]))
    || (c[k] = v);
    return c;
  },
  q = c => {
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
module.exports = (
  cookies, s = cookies && (cookies.cookie || cookies) || DOC.cookie || ''
) => q(s.split(CRe1).map(m).filter(f).reduce(r, null));