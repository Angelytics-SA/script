const { DOC, TAGS } = require('./globals');
const record = require('./record');

const FORMS = new Map;

// Hlper function to get the form and its status.
const getForm = elmt => {
  try {
    // Get parent form.
    let form = FORMS.get(elmt), tn;
    if (typeof form === 'boolean') return {
      form: elmt,
      started: form
    };
    form = elmt;
    while ((form = form.parentNode)
      && (tn = (form.tagName || '').toLowerCase()) !== 'form'
      && tn !== 'body'
    );
    FORMS.set(elmt, form);
    return {
      form,
      started: FORMS.get(form)
    };
  } catch {
    return {};
  }
}

// Input event handler.
const inputEventHandler = ({ target: elmt } = {}) => {
  if (!elmt) return;

  // Get parent form.
  const {
    form,
    started
  } = getForm(elmt);

  // Start form session.
  started || (form && (
    record({
      eventName: 'form-start',
      elmt: form,
      type: 'data',
      tags: [TAGS.design, TAGS.sales]
    }),
    FORMS.set(form, true)
  ));
}

// Helper function to get how many fileds are filled.
const getStats = form => {
  let inputs = form.querySelectorAll('input:not([type^="submit"]), textarea') || [],
    cnt = 0, emptyFields = [], fieldsWithNoIdentifier = 0;
  for (let i = 0, l = inputs.length, e; i !== l; ++i) {
    ((e = inputs[i]).getAttribute('value') || e.value) && ++cnt
      || emptyFields.push(e.getAttribute('name') || e.getAttribute('id') || (
        ++fieldsWithNoIdentifier && 'unknown'
      ));
  }
  const output =  {
    totalFields: inputs.length,
    filled: cnt
  };
  emptyFields.length && (output.emptyFields = emptyFields);
  fieldsWithNoIdentifier && (output.fieldsWithNoIdentifier = fieldsWithNoIdentifier);
  return output;
}

// Submit event handler.
const submitEventHandler = ({ target: elmt } = {}) => {
  if (!elmt) return;

  // Get parent form.
  const {
    form,
    started
  } = getForm(elmt);

  // End form session.
  started && form && (
    record({
      eventName: 'form-submit',
      elmt: form,
      type: 'data',
      tags: [TAGS.design, TAGS.sales],
      extra: getStats(form)
    }),
    FORMS.set(form, false)
  );
}

// Register handlers.
DOC.addEventListener('input', inputEventHandler);
DOC.addEventListener('submit', submitEventHandler);