const record = require('./record');

module.exports = (eventName, data, userId, tags, useEncryption) => {
  if (!eventName || typeof eventName !== 'string')
    throw Error('In sendCustomEvent: first argument must be a non-empty event identifier string');
  else return record({
    eventName,
    body: data,
    type: 'custom',
    userId,
    tags,
    ect: useEncryption
  });
};