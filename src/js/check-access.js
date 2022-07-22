import { checkValidity } from './validate';
import { getApiToken } from './auth';

//const ENDPOINT = 'https://fac-dev.app.cloud.gov/sac/access';
const ENDPOINT = 'https://fac-dev.app.cloud.gov/sac/accessandsubmission';

const FORM = document.forms[0];

// Test form data - ONLY use to test API success
const TEST_DATA = {
  certifying_auditee_contact: 'a@a.com',
  certifying_auditor_contact: 'b@b.com',
  auditor_contacts: ['c@c.com', 'd@d.com'],
  auditee_contacts: ['e@e.com', 'f@f.com'],
};

function submitForm() {
  //const formData = serializeFormData(new FormData(FORM));
  const headers = new Headers();
  headers.append('Content-type', 'application/json');

  getApiToken().then((token) => {
    headers.append('Authorization', 'Token ' + token);

    // Format form data

    fetch(ENDPOINT, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(TEST_DATA),
    })
      .then((resp) => resp.json())
      .then((data) => {
        handleAuditeeResponse(data);
      });
  });
}
/*
function serializeFormData(formData) {
  return Object.fromEntries(formData);
}
*/
function handleAuditeeResponse(data) {
  console.log(data);
  //const nextUrl = '../step-3/'; //URL value for now
  //if (data.next) window.location.href = nextUrl;
}

function setFormDisabled(shouldDisable) {
  const continueBtn = document.getElementById('create');
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

function appendContactField(btnEl) {
  const inputContainer = btnEl.parentElement;
  const template = inputContainer.querySelector('template');
  const newRow = template.content.cloneNode(true);
  inputContainer.insertBefore(newRow, template);
  const deleteBtns = Array.from(document.querySelectorAll('.delete-contact'));

  deleteBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      deleteContactField(e.target);
    });
  });
}

function deleteContactField(el) {
  const nodeName = el.nodeName;
  const inputContainer =
    nodeName == 'use'
      ? el.parentElement.parentElement.parentElement
      : nodeName == 'svg'
      ? el.parentElement.parentElement
      : el.parentElement;

  inputContainer.remove();
}

function attachEventHandlers() {
  FORM.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!allResponsesValid()) return;
    submitForm();
  });

  const fieldsNeedingValidation = Array.from(
    document.querySelectorAll('#grant-access input')
  );
  fieldsNeedingValidation.forEach((q) => {
    q.addEventListener('blur', (e) => {
      performValidations(e.target);
    });
  });

  const addContactButtons = Array.from(
    document.querySelectorAll('.add-contact')
  );
  addContactButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      appendContactField(e.target);
    });
  });
}

function init() {
  attachEventHandlers();
}

init();
