/**
 * Phone number validation
 * 
 * isKey test an object key
 * isValue test if the entry has the format of a phone number
 * isKeyValuePair test if both key and value are valid
 *
 */

const keyRe = /^num|^phone|^mobile|^cell|^tel/i,
  valueRe = /^(\+[0-9]{1,4}(\s[\.\-]\s|[\.\-]|\s|)|)(\((\s|)|)([0-9]{10}|[0-9]{5}(\s\)|\)|)(\s[\.\-]\s|[\.\-]|\s)[0-9]{5}|[0-9]{3}(\s\)|\)|)(\s[\.\-]\s|[\.\-]|\s)[0-9]{3}(\s[\.\-]\s|[\.\-]|\s)[0-9]{4}|[0-9]{2}(\s\)|\)|)(\s[\.\-]\s|[\.\-]|\s)[0-9]{2}(\s[\.\-]\s|[\.\-]|\s)[0-9]{2}(\s[\.\-]\s|[\.\-]|\s)[0-9]{2}(\s[\.\-]\s|[\.\-]|\s)[0-9]{2})$/,
  isKey = str => str && typeof str === 'string' && (str.match(keyRe) || []).length > 0,
  isValue = str => str && typeof str === 'string' && valueRe.test(str.trim()),
  isKeyValuePair = (key, value) => isKey(key) && isValue(value),
  toString = () => 'phone';

// Exports.
module.exports = {
  keyRe,
  valueRe,
  isKey,
  isValue,
  isKeyValuePair,
  toString
};
module.exports.Phone = module.exports;