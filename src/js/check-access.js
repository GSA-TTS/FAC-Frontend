import { checkValidity } from './validate';

const FORM = document.forms[1];

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

function attachEventHandlers() {
  FORM.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!allResponsesValid()) return;
    // submitForm();
  });

  const fieldsNeedingValidation = Array.from(
    document.querySelectorAll('#grant-access input')
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
