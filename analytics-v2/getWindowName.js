const { WIN } = require('./globals');

module.exports = defaultName => {
  try {
    defaultName = WIN.name || `${WIN.performance.navigation.type}`;
  } catch { }
  return defaultName || '';
}