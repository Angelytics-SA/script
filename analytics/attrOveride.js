const { DOC } = require('./globals');

// Overide Helper function.
module.exports = (
  node,
  prop,
  cb,
  force = false,
  func = (node.getAttribute && node.getAttribute(prop)) || node[prop],
  t = typeof func
) => t === 'function' && (
  node[prop] = function (...args) {
    cb();
    return func.apply(node, args);
  }
) || (
  t === 'string' && (
    node[prop] = () => {
      cb();
      eval(func);
    }
  )
) || (
  force && (node === DOC.body && DOC || node).addEventListener(prop.slice(2), cb)
);