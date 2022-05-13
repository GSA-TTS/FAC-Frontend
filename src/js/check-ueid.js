import { checkValidity } from './validate';
import { queryAPI } from './api';

(function () {
  const FORM = document.forms[1];

  function submitForm() {
    const formData = serializeFormData(new FormData(FORM));
    /* eslint-disable-next-line no-undef */
    // queryAPI(ENDPOINT, formData, { authToken, method: 'POST' });
  }

  function handleUEIDResponse(response) {
    console.log(response);
  }

  function handleApiError(error) {
    console.error(error);
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

  function serializeFormData(formData) {
    return Object.fromEntries(formData);
  }

  function setFormDisabled(shouldDisable) {
    const continueBtn = document.getElementById('continue');
    continueBtn.disabled = shouldDisable;
  }

  function resetErrorStates(el) {
    const inputsWithErrors = Array.from(
      el.querySelectorAll('.usa-radio--error')
    );
    inputsWithErrors.forEach((i) => i.classList.remove('usa-radio--error'));
  }

  function runAllValidations() {
    const inputs = Array.from(
      document.querySelectorAll('#check-eligibility input')
    );

    inputs.forEach((input) => {
      checkValidity(input);
    });

    const allValid = allResponsesValid();
    setFormDisabled(!allValid);
  }

  function allResponsesValid() {
    const inputsWithErrors = document.querySelectorAll('[class *="--error"]');
    return inputsWithErrors.length === 0;
  }

  function attachEventHandlers() {
    const btnValidateUEI = document.getElementById('validate-UEI');
    btnValidateUEI.addEventListener('click', (e) => {
      e.preventDefault();
      validateUEID();
    });

    FORM.addEventListener('submit', (e) => {
      e.preventDefault();
      // if (!allResponsesValid()) return;
      // submitForm();
    });

    const fieldsNeedingValidation = Array.from(
      document.querySelectorAll('#check-eligibility input')
    );
    fieldsNeedingValidation.forEach((q) => {
      q.addEventListener('blur', (e) => {
        checkValidity(e.target);
      });
    });
  }

  function init() {
    attachEventHandlers();
  }

  init();
})();
