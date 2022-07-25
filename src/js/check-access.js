import { checkValidity } from './validate';
import { getApiToken } from './auth';

const ENDPOINT = 'https://fac-dev.app.cloud.gov/sac/accessandsubmission';
const FORM = document.forms[0];
let addedContactNum = 1; // Counter for added contacts

function submitForm() {
  const formData = serializeFormData(new FormData(FORM));
  console.log(formData); // DELETE ME
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

function serializeFormData(formData) {
  return Object.fromEntries(formData);
}

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
  // update Id and Name attributes
  const newInputs = newRow.querySelectorAll('input');
  newInputs.forEach(function (input) {
    input.id = input.id + '-' + addedContactNum;
    input.name = input.name + '-' + addedContactNum;
  });
  // Upddate LABEL.FOR attributes
  const newLabels = newRow.querySelectorAll('label');
  newLabels.forEach(function (label) {
    label.htmlFor = label.htmlFor + '-' + addedContactNum;
  });
  // Increment added number of contacts
  addedContactNum++;

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
