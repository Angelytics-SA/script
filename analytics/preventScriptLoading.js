const { WIN, DSS, DSC, AL, P } = require('./globals');

// Helper function to block a script.
const block = elmt => elmt.setAttribute('type', 'javascript/blocked');

// Helper function to create an observer callback to block a script when a script node is inserted.
const createCallback = (isBadSrc, containsBadContent, prevent = !AL) => mutationList => {
  for (let i = 0, ml = mutationList.length || mutationList.size || 0, m; i !== ml; ++i) {
    if ((m = mutationList[i]).type !== 'childList') continue;
    for (let j = 0, a = m.addedNodes, al = a.length || a.size || 0; j !== al; ++j) {
      ((cn = a[j]).tagName || '').toLowerCase() === 'script'
        && (
          isBadSrc(cn.getAttribute('src') || cn.src || '')
          || containsBadContent(cn.innerHTML || '')
        )
        && prevent
        && block(cn);  
    }
  }
}

// No-op function.
const noop = () => {}, valid = x => x, fvalid = f => f !== noop;

// Helper function to create an eval function.
const createEvalFunc = input => {
  let a;
  Array.isArray(input) && (
    a = input.flat(Infinity).map(v => createEvalFunc(v)).filter(fvalid),
    input = a.length && (v => {
      for (let i = 0, l = a.length; i !== l; ++i) if (a[i](v)) return true;
      return false;
    }) || noop
  ) || (
    input instanceof RegExp && (
      a = input,
      input = v => (v.match(a) || []).filter(valid).length > 0
    )
  ) || (
    typeof input === 'string' && (
      a = input,
      input = v => v && typeof v === 'string' && v.includes(a)
    )
  ) || (
    typeof input !== 'function' && (input = noop)
  );

  return input;
}

// Helper function to clean disabled scripts once loaded.
const onload = () => {
  const toRemove = document.querySelectorAll(`script[type="javascript/blocked"]`);
  for (let i = 0, l = toRemove.length; i !== l; ++i) toRemove[i].remove();

  // Remove the listener.
  WIN.removeEventListener('load', onload);
}

// Detect and prevent script loading.
module.exports = (isBadSrc = DSS, containsBadContent = DSC, prevent = !(AL || P)) => {
  isBadSrc = createEvalFunc(isBadSrc);
  containsBadContent = createEvalFunc(containsBadContent);

  // Observe newly created scripts and bloc them if needed.
  const observer = new MutationObserver(createCallback(isBadSrc, containsBadContent, prevent));  
  observer.observe(document, { childList: true, subtree: true });

  if (!prevent) return false;

  // Prevent a source to load programatically.
  const originalSetAttribute = HTMLScriptElement.prototype.setAttribute;
  HTMLScriptElement.prototype.setAttribute = function (name, value) {
    name.toLowerCase() === 'src' && isBadSrc(value || '') && block(this);
    return originalSetAttribute.call(this, name, value);
  }

  // Prevent code with inner content set programmatically.
  const { get, set, ...other } = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
  Object.defineProperty(HTMLScriptElement.prototype, 'innerHTML', {
    get() { return get.call(this); },
    set(value) {
      containsBadContent(value) && block(this);
      return set.call(this, value);
    },
    ...other
  });

  // Clean scripts once everything has been loaded.
  WIN.addEventListener('DOMContentLoaded', onload);

  return true;
}