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

  function attachEventHandlers() {
    FORM.addEventListener('submit', (e) => {
      e.preventDefault();
      submitForm();
    })
  }

  function init() {
    attachEventHandlers();
  }

  init();
})();
