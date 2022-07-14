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
    handleValidUei(response);
  } else {
    handleInvalidUei(errors);
  }
}

function handleValidUei({ auditee_name }) {
  const ueiFormGroup = document.querySelector('.usa-form-group.usa-search');
  const errorContainer = document.getElementById('auditee_uei-error-message');

  document.getElementById('auditee_name').value = auditee_name;
  populateModal('success', auditee_name);

  errorContainer.hidden = true;
  errorContainer.innerHTML = '';
  ueiFormGroup.classList.remove('usa-form-group--error');
}

function handleInvalidUei(errors) {
  const ueiFormGroup = document.querySelector('.usa-form-group.usa-search');
  const errorContainer = document.getElementById('auditee_uei-error-message');
  ueiFormGroup.classList.add('usa-form-group--error');

  errors.uei.forEach((error) => {
    const errorEl = document.createElement('li');
    errorEl.innerText = error;
    errorContainer.appendChild(errorEl);
  });

  errorContainer.hidden = false;
}

function handleApiError(e) {
  populateModal('connection-error');
  console.error(e);
}

// 'connection-error' | 'not-found' | 'success'
function populateModal(formStatus, auditeeName) {
  const auditeeUei = document.getElementById('auditee_uei').value;
  const modalContainerEl = document.querySelector(
    '#uei-search-result .usa-modal__main'
  );
  const modalHeadingEl = modalContainerEl.querySelector('h2');
  const modalDescriptionEl = modalContainerEl.querySelector(
    '#uei-search-result-description'
  );
  const modalButtonPrimaryEl = modalContainerEl.querySelector('button.primary');
  const modalButtonSecondaryEl =
    modalContainerEl.querySelector('button.secondary');

  const modalContent = {
    'connection-error': {
      heading: `We can't connect to SAM.gov to confirm your UEI.`,
      description: `
        <dl>
          <dt>UEI you entered</dt>
          <dd>${auditeeUei}</dd>
        </dl>
        <p>We’re sorry for the delay. You can continue, but we’ll need confirm your UEI before your audit submission can be certified.</p>
        <p>You might also want to check the UEI you entered, go back, and try again.</p>
        `,
      buttons: {
        primary: {
          text: `Go back`,
        },
        secondary: { text: `Continue without a confirmed UEI` },
      },
    },
    success: {
      heading: 'Search Result',
      description: `
        <dl>
          <dt>Unique Entity ID</dt>
          <dd>${auditeeUei}</dd>
          <dt>Auditee name</dt>
          <dd>${auditeeName}</dd>
        </dl>
        <p>Click continue to create a new audit submission for this auditee.</p>
        <p>Not the auditee you’re looking for? Go back, check the UEI you entered, and try again.</p>
      `,
      buttons: {
        primary: {
          text: `Continue`,
        },
        secondary: { text: `Go back` },
      },
    },
    'not-found': {
      heading: 'Your UEI is not recognized',
      description: `
        <dl>
          <dt>UEI you entered</dt>
          <dd>${auditeeUei}</dd>
        </dl>
        <p>You can try re-entering the UEI. If you don’t have the UEI, you may find it at SAM.gov.</p>
        <p>You may also continue without the UEI, and you will be prompted to update the UEI before you can submit your audit.</p>
      `,
      buttons: {
        primary: {
          text: `Continue`,
        },
        secondary: { text: `Go back` },
      },
    },
  };

  const contentForStatus = modalContent[formStatus];
  modalHeadingEl.textContent = contentForStatus.heading;
  modalDescriptionEl.innerHTML = contentForStatus.description;
  modalButtonPrimaryEl.textContent = contentForStatus.buttons.primary.text;
  modalButtonSecondaryEl.textContent = contentForStatus.buttons.secondary.text;
  document.querySelector('.uei-search-result').classList.remove('loading');
}

function validateUEID() {
  const auditee_uei = document.getElementById('auditee_uei').value;

  queryAPI(
    '/sac/ueivalidation',
    { auditee_uei },
    {
      /* eslint-disable-next-line no-undef */
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
  const btnValidateUEI = document.getElementById('auditee_uei-btn');
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
