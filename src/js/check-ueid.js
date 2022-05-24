import { checkValidity } from './validate';
import { queryAPI } from './api';

const FORM = document.forms[1];

function submitForm() {
  // NOOP for now
  // const formData = serializeFormData(new FormData(FORM));
  /* eslint-disable-next-line no-undef */
  // queryAPI(ENDPOINT, formData, { authToken, method: 'POST' });
}

function handleUEIDResponse({ valid, response, errors }) {
  if (valid) {
    recordFYEndDate(response.auditee_fiscal_year_end_date);
    handleValidUei(response.auditee_name);
  } else {
    handleInvalidUei(errors);
  }
}

function handleValidUei(message) {
  const ueiFormGroup = document.querySelector('.usa-form-group.validate-uei');
  const errorContainer = document.getElementById('uei-error-message');

  document.getElementById('auditee_name').value = message;
  errorContainer.hidden = true;
  errorContainer.innerHTML = '';
  ueiFormGroup.classList.remove('usa-form-group--error');
}

function handleInvalidUei(errors) {
  const ueiFormGroup = document.querySelector('.usa-form-group.validate-uei');
  const errorContainer = document.getElementById('uei-error-message');
  ueiFormGroup.classList.add('usa-form-group--error');

  errors.uei.forEach((error) => {
    const errorEl = document.createElement('li');
    errorEl.innerText = error;
    errorContainer.appendChild(errorEl);
  });

  errorContainer.hidden = false;
}

function handleApiError() {
  const errorMsg = `We can’t connect to SAM.gov to confirm your UEI. We're sorry for the delay. You can continue, but we'll need to confirm your UEI before your audit can be certified.`;

  handleInvalidUei({ uei: [errorMsg] });
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

function recordFYEndDate(fyEndDate) {
  FORM.dataset.fyEndDate = fyEndDate;
}

function validateFyEndDate(fyInput) {
  const samFy = FORM.dataset.fyEndDate;
  if (fyInput.value == '') return;

  const fyFormGroup = document.querySelector('.usa-form-group.validate-fy');
  const fyErrorContainer = document.getElementById('fy-error-message');
  const userFy = {};
  [userFy.year, userFy.month, userFy.day] = fyInput.value.split('-');
  [samFy.month, samFy.day] = samFy.split('/');

  if (userFy.year < 2022) {
    const errorEl = document.createElement('li');
    errorEl.innerText = 'We are currently only accepting audits from FY22';
    fyErrorContainer.appendChild(errorEl);
    fyFormGroup.classList.add('usa-form-group--error');
    fyErrorContainer.focus();
  }
}

/*
We're not submitting this form yet,
so this won't be called. Rather than delete code we know we need,
just stope the linter from complaining about it for now. */
/* eslint-disable no-unused-vars */
function serializeFormData(formData) {
  return Object.fromEntries(formData);
}
/* eslint-enable */

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

  const fyInput = document.getElementById('auditee_fy_start_date_end');
  fyInput.addEventListener('change', (e) => {
    validateFyEndDate(e.target);
  });
}

function init() {
  attachEventHandlers();
}

init();
