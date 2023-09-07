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
  id,
  userId = id,
  ect, // Encryption
  url, uri = url,
  extra, detail = extra, details = detail,
  sendFunc = send
} = {}) => {
  // Get the device data.
  const data = getMetadata(elmt);
  type && (data.event || (data.event = {}), data.event.type = type);
  error && (data.event || (data.event = {}), data.event.error = error);
  eventName && (data.event || (data.event = {}), data.event.name = eventName);
  details && typeof details === 'object'
    && (
      data.event || (data.event = {}),
      Object.assign(data.event.details || (data.event.details = {}), details)
    );
  body && (data.event || (data.event = {}), data.event.body = body);
  (typeof userId === 'number' || userId)
    && (
      data.ids.user = typeof userId === 'object'
        && JSON.stringify(userId) || `${userId}`
    );
  tags
    && (Array.isArray(tags) || (tags = [tags]))
    && tags.length && (data.event || (data.event = {}), data.event.tags = tags);

  // Send data.
  typeof sendFunc === 'function' && sendFunc(data, ect, uri);
  return data;
}).send = send;
