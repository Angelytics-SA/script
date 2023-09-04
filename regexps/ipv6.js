/**
 * IP v6 validation
 * 
 * isKey test an object key
 * isValue test if the entry has the format of an IP v6
 * isKeyValuePair test if both key and value are valid
 *
 */

const keyRe = /ip[\-_~\.\s]addr|^ip/i,
  valueRe = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/gi,
  isKey = str => str && typeof str === 'string' && (str.match(keyRe) || []).length > 0,
  isValue = str => str && typeof str === 'string' && valueRe.test(str.trim()),
  isKeyValuePair = (key, value) => isKey(key) && isValue(value),
  toString = () => 'ipv6';

// Exports.
module.exports = {
  keyRe,
  valueRe,
  isKey,
  isValue,
  isKeyValuePair,
  toString
};
module.exports.Ipv6 = module.exports;