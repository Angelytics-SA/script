const { DOC } = require('./globals');

const CRe1 = /\s+;\s+|;\s+|\s+;|;/g, CRe2 = /\s+=\s+|\s+=|=\s+|=/;
module.exports = (cookies, s = cookies && (cookies.cookie || cookies) || DOC.cookie) => (
  (s || '').split(CRe1).map(s => (s || '').split(CRe2))
);