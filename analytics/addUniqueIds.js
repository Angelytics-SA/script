const { DOC, PRE_ID, IDK } = require('./globals');
let CNT = 0;
const getCnt = (n = ++CNT) => n.toString(36);

module.exports = node => {
  // Attribute a unique id to each element.
  // Those elements have to be constructed at rendering time.
  let n = node || (node = DOC.body), q = [n], t, i, l, c;
  while (n = q.pop()) {
    // Add a unique id if needed.
    !(t = n.tagName)
      || (t = t.toLowerCase()) === 'script'
      || (
        l = n.getAttribute('type') || n.type,
        i = n[IDK] = n[IDK] || `${PRE_ID}-${t}${l && `-${l}` || ''}-id-${getCnt()}`,
        n.id || n.getAttribute('id') || (n.id = i)
      );

    // Add child nodes to the queue.
    for (i = 0, c = n.childNodes || [], l = c.length; i !== l; ++i) q.push(c[i]);
  }
  return node;
}