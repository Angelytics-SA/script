const { DOC } = require('./globals');

// Helper function to create a callback from an input list of callbacks.
const createCallback = callbacks => mutationList => {
  const cl = callbacks.length;
  for (let i = 0, ml = mutationList.length || mutationList.size || 0, m; i !== ml; ++i) {
    if ((m = mutationList[i]).type !== 'childList') continue;
    for (let j = 0, a = m.addedNodes, al = a.length || a.size || 0; j !== al; ++j) {
      for (let k = 0, cn = a[j]; k !== cl; ++k) {
        callbacks[k](cn);
      }
    }
  }
}

module.exports = (target, ...callbacks) => {
  target || (target = DOC.body);

  // Replacement mutation observer code:
  const observer = new MutationObserver(createCallback(callbacks.flat(Infinity)));  
  observer.observe(target, { childList: true, subtree: true });
  return observer;
}

 