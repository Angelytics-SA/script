module.exports = f => (
  typeof f === 'function'
  && !f.constructor.name.toLowerCase().includes('async')
  && async function(...args) { return f(...args); }
  || f
);