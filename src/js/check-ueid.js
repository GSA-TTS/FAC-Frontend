import { checkValidity } from './validate';
import { queryAPI } from './api';

const FORM = document.forms[1];

function submitForm() {
  const formData = serializeFormData(new FormData(FORM));
  /* eslint-disable-next-line no-undef */
  // queryAPI(ENDPOINT, formData, { authToken, method: 'POST' });
}

function handleUEIDResponse({ valid, response, errors }) {
  if (valid) {
    handleValidUei(response.auditee_name);
  } else {
    handleInvalidUei(errors);
  }
}

function handleValidUei(message) {
  const messageContainer = document.getElementById('uei-success');
  const entityNameContainer = messageContainer.querySelector('span');
  entityNameContainer.innerText = message;
  messageContainer.hidden = false;
}

function handleInvalidUei(errors) {
  const messageContainer = document.querySelector(
    '.usa-form-group.validate-uei'
  );
  const errorContainer = document.getElementById('uei-error-message');
  messageContainer.classList.add('usa-form-group--error');

  errors.uei.forEach((error) => {
    const errorEl = document.createElement('li');
    errorEl.innerText = error;
    errorContainer.appendChild(errorEl);
  });

  errorContainer.hidden = false;
}

function handleApiError(error) {
  console.error(error);
}

function validateUEID() {
  const uei = document.getElementById('auditee_ueid').value;
  queryAPI(
    '/sac/ueivalidation',
    { uei },
    {
      /* eslint-disable-next-line no-undef */
      authToken,
      method: 'POST',
    },
    [handleUEIDResponse, handleApiError]
  );
}

function serializeFormData(formData) {
  return Object.fromEntries(formData);
}

function setFormDisabled(shouldDisable) {
  const continueBtn = document.getElementById('continue');
  continueBtn.disabled = shouldDisable;
}

function allResponsesValid() {
  const inputsWithErrors = document.querySelectorAll('[class *="--error"]');
  return inputsWithErrors.length === 0;
}

function performValidations(field) {
  const errors = checkValidity(field);
  setFormDisabled(errors.length > 0);
}

function attachEventHandlers() {
  const btnValidateUEI = document.getElementById('validate-UEI');
  btnValidateUEI.addEventListener('click', (e) => {
    e.preventDefault();
    validateUEID();
  });

  FORM.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!allResponsesValid()) return;
    submitForm();
  });

  const fieldsNeedingValidation = Array.from(
    document.querySelectorAll('#check-eligibility input')
  );
  fieldsNeedingValidation.forEach((q) => {
    q.addEventListener('blur', (e) => {
      performValidations(e.target);
    });
  });
}

function init() {
  attachEventHandlers();
}

init();
