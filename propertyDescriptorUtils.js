// Function to get the property info of an object.
const getType = (o, k) => {
  try {
    return typeof o[k];
  } catch {
    return 'undefined';
  }
},

getPropertyDescriptor = (obj, key, d = Object.getOwnPropertyDescriptor(obj, key) || {}) => ({
  name: key,
  type: d.get && d.get && 'getter/setter' || (d.get && 'getter') || (d.set && 'setter') || getType(obj,key),
  ...(Object.getOwnPropertyDescriptor(obj, key) || {})
}),

// Function to get the properties info of an object.
getPropertyDescriptors = (obj, output = [], o = obj || {}) => {
  for (key in o) output.push(getPropertyDescriptor(o, key));
  return output;
},

// Function to get element propeties (static, attributes and methods).
getElementProperties = (...elmts) => {
  for (let i = 0, l = (elmts = elmts.flat()).length; i !== l; ++i)
  elmts[i] = [
    elmts[i],
    getPropertyDescriptors(elmts[i]), // Get static props
    getPropertyDescriptors(elmts[i].prototype), // Get methods and attributes
  ];

  return elmts.length === 1 && elmts[0] || elmts.length && elmts || undefined;
}