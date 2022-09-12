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
  const errors = checkValidity(field);
  setFormDisabled(errors.length > 0);
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

function submitSacForm() {
  const sacForm = document.getElementById('general-info');
  const sacData = new FormData(sacForm);
  const sacObj = Object.fromEntries(sacData.entries());
  sacObj.multiple_ueis_covered =
    sacObj.multiple_ueis_covered == 'true' ? true : false;
  sacObj.multiple_eins_covered =
    sacObj.multiple_eins_covered == 'true' ? true : false;
  const params = new URLSearchParams(window.location.search);
  const reportId = params.get('reportId');

  if (!reportId) return;

  queryAPI(`/sac/edit/${reportId}`, sacObj, { method: 'PUT' }, [
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
    document.querySelectorAll('.sf-sac input[data-validate-not-null]')
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
