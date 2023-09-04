/**
 * Social security number validation
 * 
 * isKey test an object key
 * isValue test if the entry has the format of a social security number
 * isKeyValuePair test if both key and value are valid
 *
 */

const keyRe = /^ssn|^social/i,
  valueRe = /^([0-9]{3}\s[0-9]{2}\s[0-9]{4}|[0-9]{3}\-[0-9]{2}\-[0-9]{4}|[0-9]{3}\.[0-9]{2}\.[0-9]{4})$/,
  isKey = str => str && typeof str === 'string' && (str.match(keyRe) || []).length > 0,
  isValue = str => str && typeof str === 'string' && valueRe.test(str.trim()),
  isKeyValuePair = (key, value) => isKey(key) && isValue(value),
  toString = () => 'ssn';

// Exports.
module.exports = {
  keyRe,
  valueRe,
  isKey,
  isValue,
  isKeyValuePair,
  toString
};
module.exports.Ssn = module.exports;