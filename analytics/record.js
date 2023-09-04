const send = require('./send');
const getMetadata = require('./getMetadata');

(module.exports = ({
  eventName,
  data: _data,
  body = _data,
  elmt,
  error,
  type,
  tags = [], // dev, sales, design, ...
  userId,
  ect, // Encryption
  url, uri = url,
  extra, detail = extra, details = detail,
  sendFunc = send
} = {}) => {
  // Get the device data.
  const data = getMetadata(elmt);
  type && (data.eventType = type);
  error && (data.error = error);
  eventName && (data.eventName = eventName);
  details && typeof details === 'object' && Object.assign(data.details || (data.details = {}), details);
  body && (data.body = body);
  (typeof userId === 'number' || userId) && (data.userId = typeof userId === 'object' && JSON.stringify(userId) || `${userId}`)
  tags && (Array.isArray(tags) || (tags = [tags])) && tags.length && (data.tags = tags);

  // Send data.
  typeof sendFunc === 'function' && sendFunc(data, ect, uri);
  return data;
}).send = send;
