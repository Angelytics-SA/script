(() => { // Start of code | to be inserted before other analytics but after the angelitics script

// List of elements to check.
const ELEMENTS = [
  HTMLFormElement,
  HTMLInputElement,
  HTMLTextAreaElement,
  HTMLIFrameElement
],

// Function to return a descriptor that prevents property / attribute / method override.
getRestrictedOverrideDescriptor = (d, o = { configurable: false }, ) => {
  d.enumerable && (o.enumerable = true);
  d.get && (o.get = d.get);
  d.set && (o.set = d.set);
  d.get || d.set || ((o.value = d.value), o.writable = false);
  return o;
},

// Function to protect object property / attribute / method.
protectObjectProperty = (o, k, d) => (
  (typeof (d = Object.getOwnPropertyDescriptor(o || {}, k) || {}).value === 'function' || d.get || d.set)
    && d.configurable
    && Object.defineProperty(o, k, getRestrictedOverrideDescriptor(d))
);

// Prevent override.
for (let i = 0, l = ELEMENTS.length, o, k, n, j, m; i !== l; ++i) {
  o = ELEMENTS[i];
  for (k in o) protectObjectProperty(o, k);
  for (j = 0, m = (n = Object.getOwnPropertyNames(o = Object.seal(o).prototype || {})).length; j !== m; ++j)
    protectObjectProperty(o, n[j]);
  Object.seal(o);
}

})(); // End of code