(function () {
  const ENDPOINT = 'https://fac-dev.app.cloud.gov/sac/eligibility';
  const FORM = document.forms[1];

  function submitForm() {
    const formData = serializeFormData(new FormData(FORM));
    const headers = new Headers();

    headers.append('Content-type', 'application/json');
    headers.append('Authorization', 'Basic ' + authToken); // authToken is set in a script tag right before this script loads

    fetch(ENDPOINT, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(formData)
    }).then(resp => resp.json())
      .then(data => console.log(data)); // Just log the response for now
  }

  function serializeFormData(formData) {
    return Object.fromEntries(formData);
  }

  function isValidEntity({name, id}) {
    const INVALID_ENTITY_TYPES = {
      user_provided_organization_type: ["entity-none"],
      met_spending_threshold: ["spend-no"],
      is_usa_based: ["us-no"]
    }

    return !INVALID_ENTITY_TYPES[name].includes(id);
  }

  function resetErrorStates(el) {
    const inputsWithErrors = Array.from(el.querySelectorAll('.usa-radio--error'));
    inputsWithErrors.forEach(i => i.classList.remove('usa-radio--error'));
  }

  function validateEntity(entity) {
    const radioEl = entity.parentElement;
    const fieldsetEl = radioEl.parentElement;
    resetErrorStates(fieldsetEl);

    if (!isValidEntity(entity) && entity.checked) {
      radioEl.classList.add('usa-radio--error');
    };
  }

  function runAllValidations() {
    const inputs = Array.from(document.querySelectorAll('.question input'));
    const validations = [validateEntity];

    inputs.forEach(input => {
      validations.forEach(validation => validation(input));
    })
  }

  function allResponsesValid() {
    const inputsWithErrors = document.querySelectorAll('[class *="--error"]');
    return inputsWithErrors.length === 0;
  }

  function attachEventHandlers() {
    FORM.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!allResponsesValid()) return;
      submitForm();
    })

    const questions = Array.from(document.querySelectorAll('.question'));
    questions.forEach(q => {
      q.addEventListener('change', e => validateEntity(e.target));
    });
  }

  function init() {
    attachEventHandlers();
    runAllValidations(); // Run these on load in case the user refreshed
  }

  init();
})();
