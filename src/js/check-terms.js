import { checkValidity } from './validate';

function allResponsesValid() {
  const inputsWithErrors = document.querySelectorAll('[class *="--error"]');
  return inputsWithErrors.length === 0;
}

function performValidations(field) {
  checkValidity(field);
}

function attachEventHandlers() {
  const fieldsNeedingValidation = Array.from(
    document.querySelectorAll('.sf-sac input[data-validate-not-null]')
  );

  const FORM = document.forms[0];
  FORM.addEventListener('submit', (e) => {
    e.preventDefault();

    fieldsNeedingValidation.forEach((q) => {
      performValidations(q);
    });

    if (allResponsesValid()) {
      // submitForm();
    }
  });
}

function init() {
  attachEventHandlers();
}

init();
