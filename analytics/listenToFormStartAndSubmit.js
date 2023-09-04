const { DOC, TAGS, IDK } = require('./globals');
const record = require('./record');

const S = new Set;

module.exports = (
  forms,
  set = S,
) => {
  // Normalize input.
  forms || (forms = DOC.getElementsByTagName('form') || []);
  let _forms;
  Array.isArray(forms)
    || (
      (_forms = Array.from(forms)).length
      && (forms = _forms)
    )
    || (forms = [forms]);

  // Add event listener.
  for (let i = 0, l = forms.length, f, id, onchange, onsubmit; i !== l; ++i) {
    f = forms[i];
    id = f[IDK];
    if (id && set && set.has(id)) continue;
    id && set && set.add(id);
    onsubmit = () => {
      record({
        eventName: 'form-submit',
        elmt: f,
        type: 'data',
        tags: [TAGS.design, TAGS.sales]
      });
      f.removeEventListener('submit', onsubmit);
      f.addEventListener('change', onchange);
    }
    onchange = () => {
      record({
        eventName: 'form-start',
        elmt: f,
        type: 'data',
        tags: [TAGS.design, TAGS.sales]
      });
      f.removeEventListener('change', onchange);
      f.addEventListener('submit', onsubmit);
    }
    f.addEventListener('change', onchange);
  }
}   