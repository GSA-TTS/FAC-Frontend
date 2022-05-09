import { checkValidity } from './validate';

(function () {
  const ENDPOINT = 'https://fac-dev.app.cloud.gov/sac/eligibility';
  const FORM = document.forms[1];

  function submitForm() {
    const formData = serializeFormData(new FormData(FORM));
    const headers = new Headers();

    headers.append('Content-type', 'application/json');
    /* eslint-disable-next-line no-undef */
    headers.append('Authorization', 'Basic ' + authToken); // authToken is set in a script tag right before this script loads

    fetch(ENDPOINT, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(formData),
    })
      .then((resp) => resp.json())
      .then((data) => console.log(data)); // Just log the response for now
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
