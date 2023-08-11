// Get DOM parser class.
const DOMParser = new (require('jsdom').JSDOM)().window.DOMParser;

/**
 * Get the url domain name. Does not capture the port, contrary to 'origin' method.
 * @param  {URL} url The input url
 * @return {String}  The url domain name
 */
URL.getDomain || (URL.getDomain = (
  url,
  protocol = (url instanceof URL && url || (url = new URL(url))).protocol || '',
  hostname = url.hostname || ''
) => (
  (protocol.charAt(protocol.length - 1) === '/' && protocol || `${protocol}//`) + hostname
));
URL.prototype.domain || Object.defineProperty(URL.prototype, 'domain', {
  get () {
    return URL.getDomain(this);
  }
});

/**
 * Get the url page name. Does not capture search params or passwords.
 * @param  {URL} url The input url
 * @return {String}  The url domain name
 */
URL.getPageOrigin || (URL.getPageOrigin = (
  url,
  origin = (url instanceof URL && url || (url = new URL(url))).origin || '',
  pathname = url.pathname || ''
) => (
  origin + pathname
));
URL.prototype.pageOrigin || Object.defineProperty(URL.prototype, 'pageOrigin', {
  get () {
    return URL.getPageOrigin(this);
  }
});

/**
 * Convert a template string into HTML DOM nodes
 * @param  {String} str The template string
 * @return {Node}       The template HTML
 */
String.toNode || (String.toNode = (str, parser = new DOMParser()) => (
  parser.parseFromString(str, 'text/html')
));
String.prototype.toNode || (String.prototype.toNode = function(parser) {
  return String.toNode(this, parser);
});

/**
 * Fetch an URL and output its HTML structure
 * @param  {String} url The url string
 * @return {String}     The stringified HTML
 */
const fetchContent = async url => await fetch(url instanceof URL && url.toString() || url)
  .then(response => response.text()) // that's the stringified html doc
  .catch(err => console.log(`Unable to fetch - ${err}`));

/**
 * Get array of node attribute: [[name_1, value_1], ..., [name_n, value_n]].
 * @param  {Node} node The input node object
 * @return {Array}     The list of node attributes
 */
const getNodeAttributes = (node, output = []) => {
  output || (output = []);
  if (node && typeof node.hasAttributes === 'function' && node.hasAttributes()) {
    for (const attr of node.attributes)  output.push([attr.name, attr.value]);
  }
  return output;
}

/**
 * Stringify a node and it's children.
 * @param  {Node} node The input node object
 * @return {String}    The stringified node tree
 */
const stringifyNode = (node, indent = '', output = '') => {
  let textContent, content;

  // Comment.
  if (node.nodeType === node.COMMENT_NODE) {
    return `${indent}<!-- ${node.textContent || node.innerHTML || ''} -->`;
  }

  // Like div, span, etc.
  if (node.tagName) {
    // Get node attributes.
    const attrs = getNodeAttributes(node).map(([k, v]) => `${k}="${v}"`).join(' ');

    // Opening tag.
    output += `${indent}<${node.tagName}${attrs && ` ${attrs} ` || ''}>`;
    for (let i = 0, c = node.childNodes, l = c && c.length || 0; i !== l; ++i) {
      content = stringifyNode(c[i], indent + '  ');
      output += `${content.trim() && '\n' || ''}${content}`;
    }

    // If no children but still some content.
    !(node.childNodes && node.childNodes.length)
      && (textContent = (node.textContent || node.innerHTML || '').trim())
      && (output += `\n${indent}  ${textContent}`);

    // Closing tag.
    output += `${(node.childNodes && node.childNodes.length || textContent) && `\n${indent}` || ''}</${node.tagName}>`;
  } else {
    // Like a Document node.
    for (let i = 0, c = node.childNodes, l = c && c.length || 0; i !== l; ++i) {
      content = stringifyNode(c[i], indent);
      output += `${content.trim() && '\n' || ''}${content}`;
    }

    // Like text Node
    !(node.childNodes && node.childNodes.length)
      && (textContent = (node.textContent || node.innerHTML || '').trim())
      && (output += `${indent}${textContent}`);
  }
  return output;
}

// Try to attach it to Node.
try {
  Node.prototype.toString = function() { return stringifyNode(this); }
} catch {}

// Exports.
module.exports = {
  fetchContent,
  getNodeAttributes,
  stringifyNode
};