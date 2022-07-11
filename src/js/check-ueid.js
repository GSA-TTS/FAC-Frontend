import { checkValidity } from './validate';
import { queryAPI } from './api';
import { getApiToken } from './auth';

const ENDPOINT = 'https://fac-dev.app.cloud.gov/sac/auditee';
//const ENDPOINT = '/sac/auditee';
const FORM = document.forms[0];

function submitForm() {
  // Format Dates
  let start_input = document.getElementById('auditee_fiscal_period_start');
  start_input.value = new Date(start_input.value).toLocaleDateString('en-CA');
  let end_input = document.getElementById('auditee_fiscal_period_end');
  end_input.value = new Date(end_input.value).toLocaleDateString('en-CA');

  const formData = serializeFormData(new FormData(FORM));
  const headers = new Headers();
  headers.append('Content-type', 'application/json');

  getApiToken().then((token) => {
    headers.append('Authorization', 'Token ' + token);

    fetch(ENDPOINT, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(formData),
    })
      .then((resp) => resp.json())
      .then((data) => {
        handleAuditeeResponse(data);
      });
  });
}

function handleAuditeeResponse(data) {
  const nextUrl = '../step-3/'; //URL value for now
  if (data.next) window.location.href = nextUrl;
}

function handleUEIDResponse({ valid, response, errors }) {
  if (valid) {
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
  const uei = document.getElementById('auditee_uei').value;
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

function validateFyStartDate(fyInput) {
  if (fyInput.value == '') return;

  const fyFormGroup = document.querySelector('.usa-form-group.validate-fy');
  const fyErrorContainer = document.getElementById('fy-error-message');
  const userFy = {};
  [userFy.year, userFy.month, userFy.day] = fyInput.value.split('-');

  if (userFy.year < 2020) {
    const errorEl = document.createElement('li');
    errorEl.innerHTML =
      'We are currently only accepting audits from FY22.\
      To submit an audit for a different fiscal period, \
      visit the <a href="https://facides.census.gov/Account/Login.aspx">Census Bureau</a>.';
    fyErrorContainer.appendChild(errorEl);
    fyFormGroup.classList.add('usa-form-group--error');
    fyErrorContainer.focus();
  } else {
    fyFormGroup.classList.remove('usa-form-group--error');
    fyErrorContainer.innerHTML = '';
  }

  setFormDisabled(!allResponsesValid());
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
  return inputsWithErrors.length == 0;
}

function performValidations(field) {
  const errors = checkValidity(field);
  setFormDisabled(errors.length > 0);
}

function attachEventHandlers() {
  const btnValidateUEI = document.getElementById('auditee_ueid-btn');
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

  const fyInput = document.getElementById('auditee_fiscal_period_start');
  fyInput.addEventListener('change', (e) => {
    validateFyStartDate(e.target);
  });
}

function init() {
  attachEventHandlers();
}

init();
