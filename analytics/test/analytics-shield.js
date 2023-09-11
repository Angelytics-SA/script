const DOMAIN = new URL(window.location.href).hostname.toLowerCase();

// Helper function to get a random url for the iFrame source.
const getSrc = (
  d = DOMAIN,
  s = ((Date.now() + ((Math.random() * 2048) | 0)) & 2047).toString(36)
) => 'https://' + d.slice(0, Math.max(d.lastIndexOf('.'), 0) || d.length) + '-' + s + '.com';

// Helper function to get the iframe document.
const getDoc = (iframe, el = iframe || {}) => (
  el.document
  || el.contentDocument
  || (el.contentWindow || {}).document
);

// Helper function to get the iframe window.
const getWin = (iframe, el = iframe || {}) => el.contentWindow;

// Helper function to lock iframe src.
const lockSrc = (iframe, src, newscr = getSrc()) => {
  try {
    if (src && new URL(src).hostname.toLowerCase() !== DOMAIN) return iframe;
  } catch {};

  // Lock down the source property.
  Object.defineProperty(iframe, 'src', {
    get() { return newscr; },
    set(v) { return newscr; },
    enumerable: false,
    configurable: false
  });
  const setAttribute = iframe.setAttribute,
    getAttribute = iframe.getAttribute;
  Object.defineProperty(iframe, 'setAttribute', {
    value: function (name, value) {
      return (name || '').toLowerCase() === 'src' && newscr
        || setAttribute.call(iframe, name, value);
    },
    configurable: false
  });
  Object.defineProperty(iframe, 'getAttribute', {
    value: function (name) {
      return (name || '').toLowerCase() === 'src' && newscr
        || getAttribute.call(iframe, name);
    },
    configurable: false
  });

  return iframe;
} 

// Helper function to check if the document is ready.
const ready = (doc, callback) => {
  if (doc.readyState !== 'loading') { return callback(); }
  const cb = () => {
    doc.removeEventListener('DOMContentLoaded', cb);
    return callback();
  }
  return doc.addEventListener('DOMContentLoaded', cb);
}

// Helper function to clean node content.
const cleanNode = root => {
  for (const node of root.childNodes) {
    node instanceof Text && !(node.textContent || '').replace(/\s+/, '') && node.remove();
  }
  return root;
}

// Template iFrame and other elements.
const _slot = document.createElement('slot'),
  _container =  document.createElement('template'),
  _head = document.createElement('head'),
  _body= document.createElement('body'),
  _script= document.createElement('script'),
  _documentFragment = new DocumentFragment;

// Set main template inner html.
_container.innerHTML = `
<style>
iframe {
  margin: 0;
  padding: 0;
  border: 0;
  outline: none;
  outline-style: none;
}
</style>
<iframe></iframe>
`;
cleanNode(_container.content);

// Set head template inner html.
_head.innerHTML = `
<style>

* {
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;
  overflow: visible;
  overflow-anchor: auto;
  scroll-behavior: smooth;
}

*:focus {
  outline: none;
  outline-style: none;
}

html,
body {
  margin: 0;
  padding: 0;
  border: 0;
  white-space: nowrap;
}
</style>`;
cleanNode(_head);

// Set script template type attribute.
_script.setAttribute('type', 'text/javascript');

// To generate iframe ids.
let CNT = 0, PRE = 'generated-analytics-shield-id-';

// Main class.
class Shield extends HTMLElement {
  // Private class properties.
  #slot;
  #container;

  // Constructor.
  constructor() {
    // Init the element.
    super();

    // Create iframe, slot and event listener.
    const container = this.#container = _container.content.cloneNode(true),
      id = `${PRE}${++CNT}`,
      iframe = container.childNodes[1],
      slot = this.#slot = _slot.cloneNode(true),
      shadowRoot = this.attachShadow({ mode: 'open' }),
      onslotchange = e => {
        // Remove listener.
        slot.removeEventListener('slotchange', onslotchange);

        // Clone elements.
        const head = _head.cloneNode(true),
          body = _body.cloneNode(true),
          script = _script.cloneNode(true),
          childNodes = e.target.assignedNodes({ flatten: true });

        // Add elements either to the head or the body.
        let content = head;
        for (const childNode of childNodes) {
          childNode instanceof HTMLLinkElement
          || childNode instanceof HTMLScriptElement
          || childNode instanceof HTMLMetaElement
          || childNode instanceof HTMLTitleElement
          || childNode instanceof HTMLHeadElement
          || childNode instanceof HTMLStyleElement
          || (content = body);
          content.appendChild(childNode);
        }

        // Add script node to body;
        script.textContent = 
`const onload = () => {
  const body = document.body,
    html = document.documentElement,
    o = {
      w: Math.max(body.scrollWidth || 0, body.offsetWidth || 0, html.clientWidth || 0, html.scrollWidth || 0, html.offsetWidth || 0),
      h: Math.max(body.scrollHeight || 0, body.offsetHeight || 0, html.clientHeight || 0, html.scrollHeight || 0, html.offsetHeight || 0)
    };
  const cb = () => {
    window.top.postMessage('event-for-${id}' + JSON.stringify(o), '*');
  },
  observer = new MutationObserver(cb);
  observer.observe(body, { childList: true, subtree: true });
  cb();
  window.removeEventListener('DOMContentLoaded', onload);
};
window.addEventListener('DOMContentLoaded', onload);`;

        // Add script.
        head.appendChild(script);

        // Register window message.
        const cb = e => {
          const data = e.data || '',
            refId = `event-for-${id}`,
            str = data.replace(refId, ''),
            eventId = data.replace(str, '');
          if (eventId === refId) {
            const { w, h } = JSON.parse(str);
            iframe.style['min-width'] = w + 'px';
            iframe.style['min-height'] = h + 'px';
          }
          // window.removeEventListener('message', cb);
        }
        window.addEventListener('message', cb);

        // Swap nodes.
        slot.parentNode.replaceChild(container, slot);

        // Setup iframe dimensions.
        let v;
        (v = this.getAttribute('width')) 
          && v !== 'auto'
          && v !== 'none'
          || (iframe.style.width = 0, this.removeAttribute('width'));
        (v = this.getAttribute('height')) 
          && v !== 'auto'
          && v !== 'none'
          || (iframe.style.height = 0, this.removeAttribute('height'));

        // Transfer attributes to iframe.
        for (const attr of this.attributes) {
          attr.name.toLowerCase() !== 'id'
            && attr.value
            && iframe.setAttribute(attr.name, attr.value);
        }

        // Fill iframe, via the src attribute.
        iframe.setAttribute('src', `data:text/html;charset=utf-8,<!DOCTYPE html>${head.outerHTML}${body.outerHTML}</html>`);

        // Lock iframe source if needed.
        lockSrc(iframe);
      };

    // Set iframe id.
    iframe.setAttribute('id', id);

    // Add event listener to slot element.
    slot.addEventListener('slotchange', onslotchange);

    // Add slot to shadow root.
    shadowRoot.appendChild(slot);
  }

  // Tackle other behavior, like specifying an external source.
  connectedCallback () {
    const src = this.getAttribute('src');

    // If source is specified instead of children.
    if (src) {
      const slot = this.#slot, container = this.#container, iframe = container.childNodes[1];
      slot.removeEventListener('slotchange', onslotchange);

      // Swap nodes.
      slot.parentNode.replaceChild(container, slot);

      // Load iframe srouce.
      // Note: the iframe attributes, like width, height, etc,
      // will have to be settup manually.
      for (const attr of this.attributes) {
        attr.value && iframe.setAttribute(attr.name, attr.value);
      }

      // Lock iframe source if needed.
      lockSrc(iframe, src);
    }
  }
}

// Register extended class.
window.customElements.define('analytics-shield', Shield);
