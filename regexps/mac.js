/**
 * MAC addresse validation
 * 
 * isKey test an object key
 * isValue test if the entry has the format of an MAC
 * isKeyValuePair test if both key and value are valid
 *
 */

const keyRe = /mac[\-_~\.\s]addr|^mac|^serial|^num|^addr|^id/i,
  valueRe = /\b([0-9A-F]{2}[:-]){5}([0-9A-F]){2}\b/i,
  isKey = str => str && typeof str === 'string' && (str.match(keyRe) || []).length > 0,
  isValue = str => str && typeof str === 'string' && valueRe.test(str.trim()),
  isKeyValuePair = (key, value) => isKey(key) && isValue(value),
  toString = () => 'mac';

// Exports.
module.exports = {
  keyRe,
  valueRe,
  isKey,
  isValue,
  isKeyValuePair,
  toString
};
module.exports.Mac = module.exports;