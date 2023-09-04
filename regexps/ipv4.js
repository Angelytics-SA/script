/**
 * IP v4 validation
 * 
 * isKey test an object key
 * isValue test if the entry has the format of an IP v4
 * isKeyValuePair test if both key and value are valid
 *
 */

const keyRe = /ip[\-_~\.\s]addr|^ip/i,
  valueRe = /^(?!.*\.$)((?!0\d)(1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/,
  isKey = str => str && typeof str === 'string' && (str.match(keyRe) || []).length > 0,
  isValue = str => str && typeof str === 'string' && valueRe.test(str.trim()),
  isKeyValuePair = (key, value) => isKey(key) && isValue(value),
  toString = () => 'ipv4';

// Exports.
module.exports = {
  keyRe,
  valueRe,
  isKey,
  isValue,
  isKeyValuePair,
  toString
};
module.exports.Ipv4 = module.exports;