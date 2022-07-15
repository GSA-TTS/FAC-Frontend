import { checkValidity } from './validate';

const FORM = document.forms[0];

function submitForm() {
  const nextUrl = '../new/step-1/'; //Replace with final URL
  window.location.href = nextUrl;
}

function allResponsesValid() {
  const inputsWithErrors = document.querySelectorAll('[class *="--error"]');
  return inputsWithErrors.length === 0;
}

function performValidations(field) {
  checkValidity(field);
}

function attachEventHandlers() {
  const fieldsNeedingValidation = Array.from(
    document.querySelectorAll(
      '#start-new-submission input[data-validate-not-null]'
    )
  );

  FORM.addEventListener('submit', (e) => {
    e.preventDefault();

    fieldsNeedingValidation.forEach((field) => performValidations(field));

    if (!allResponsesValid()) return;

    submitForm();
  });

  fieldsNeedingValidation.forEach((field) => {
    field.addEventListener('blur', (e) => performValidations(e.target));
  });
}

function init() {
  attachEventHandlers();
}

init();
