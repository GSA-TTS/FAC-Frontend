import { checkValidity } from './validate';
import { queryAPI } from './api';

const FORM = document.forms[0];

function setFormDisabled(shouldDisable) {
  const continueBtn = document.getElementById('continue');
  continueBtn.disabled = shouldDisable;
}

function allResponsesValid() {
  const inputsWithErrors = document.querySelectorAll('[class *="--error"]');
  return inputsWithErrors.length === 0;
}

function performValidations(field) {
  checkValidity(field);
  setFormDisabled(!allResponsesValid());
}

function highlightActiveNavSection() {
  let currentFieldsetId;

  const fieldsets = document.querySelectorAll('fieldset[id]');
  const navLinks = document.querySelectorAll('li .usa-sidenav__item a');

  fieldsets.forEach((f) => {
    const fieldsetTop = f.offsetTop;
    if (scrollY >= fieldsetTop + 100) {
      currentFieldsetId = f.id;
    }
  });

  navLinks.forEach((l) => {
    if (currentFieldsetId) {
      l.classList.remove('usa-current');
    }

    if (l.getAttribute('href') == `#${currentFieldsetId}`) {
      l.classList.add('usa-current');
    }
  });
}

function processSacFormData(formData) {
  formData.multiple_ueis_covered =
    formData.multiple_ueis_covered == 'true' ? true : false;
  formData.multiple_eins_covered =
    formData.multiple_eins_covered == 'true' ? true : false;
  formData.ein_not_an_ssn_attestation =
    formData.ein_not_an_ssn_attestation == '' ? true : false;
  formData.auditor_ein_not_an_ssn_attestation =
    formData.auditor_ein_not_an_ssn_attestation == '' ? true : false;

  return formData;
}

function submitSacForm() {
  const sacForm = document.getElementById('general-info');
  const sacData = new FormData(sacForm);
  const sacObj = Object.fromEntries(sacData.entries());
  const preparedSacObj = processSacFormData(sacObj);

  const params = new URLSearchParams(window.location.search);
  const reportId = params.get('reportId');

  if (!reportId) return;

  queryAPI(`/sac/edit/${reportId}`, preparedSacObj, { method: 'PUT' }, [
    function (data) {
      /*
       * Do whatever has to be done after submitting
       **/
      console.log(data);
    },
    function (error) {
      console.error(error);
    },
  ]);
}

function attachEventHandlers() {
  const fieldsNeedingValidation = Array.from(
    document.querySelectorAll('.sf-sac [data-validate-not-null]')
  );

  FORM.addEventListener('submit', (e) => {
    e.preventDefault();

    fieldsNeedingValidation.forEach((q) => {
      performValidations(q);
    });
    if (!allResponsesValid()) return;
    submitSacForm();
  });

  fieldsNeedingValidation.forEach((q) => {
    q.addEventListener('change', (e) => {
      performValidations(e.target);
    });
  });

  const submitBtn = document.getElementById('continue');
  submitBtn.addEventListener('click', () => {
    fieldsNeedingValidation.forEach((q) => {
      performValidations(q);
    });
  });

  window.addEventListener('scroll', highlightActiveNavSection);
}

function init() {
  attachEventHandlers();
}

init();
