const send = require('./send');
const getMetadata = require('./getMetadata');
const afy = require('./asyncify');

(module.exports = ({
  eventName,
  data: _data,
  body = _data,
  element,
  elmt = element,
  error,
  type,
  tags = [], // dev, sales, design, ...
  id,
  userId = id,
  url, uri = url,
  extra, detail = extra, details = detail,
  sendFunc = send,
  resolve,
  reject
} = {}) => {
  // Get the device data.
  const data = getMetadata(elmt);

  try {
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
  } catch {};

  // Send data.
  typeof sendFunc === 'function'
    && (sendFunc === send || (sendFunc = afy(sendFunc)))
    && sendFunc(data, uri).then(response => {
    typeof resolve === 'function' && resolve(response);
  }).catch(error => {
    typeof reject === 'function' && reject(error);
  });

  return data;
}).send = send;
