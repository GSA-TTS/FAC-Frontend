(function () {
  function init() {
    const START_SUBMISSION_URL = '../audit/new/step-1/';
    const submissions_table = document.getElementById('audit-submissions');
    const uei_link = submissions_table.querySelector('th .usa-link');
    uei_link.setAttribute('href', '#modal-uei-info');
    uei_link.setAttribute('aria-controls', 'modal-uei-info');
    uei_link.setAttribute('data-open-modal', '');
    const modal_uei_second_button = document.querySelectorAll(
      '#modal-uei-info .usa-button-group__item'
    )[1];
    modal_uei_second_button.remove();

    const terms_form = document.querySelector('#start-new-submission');
    terms_form.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('FORM SUBMITTED');
    });
    const terms_checkbox = terms_form.querySelector(
      '#check-start-new-submission'
    );
    const terms_start_sub = terms_form.querySelector('#start-submission');
    terms_checkbox.addEventListener('change', (e) => {
      e.target.checked == true
        ? (terms_start_sub.disabled = false)
        : (terms_start_sub.disabled = true);
    });
    const terms_trigger = terms_form.querySelector('#terms-conditions-trigger');
    terms_trigger.setAttribute('aria-controls', 'modal-terms-conditions');
    terms_trigger.setAttribute('data-open-modal', '');
    const button_accept = document.querySelectorAll(
      '#modal-terms-conditions .usa-button-group__item'
    )[0];
    button_accept.addEventListener('click', () => {
      terms_checkbox.checked = true;
      triggerEvent(terms_checkbox, 'change');
      window.location.href = START_SUBMISSION_URL;
    });
    terms_start_sub.addEventListener('click', () => {
      window.location.href = START_SUBMISSION_URL;
    });
  }
  function triggerEvent(element, eventName) {
    var event = new Event(eventName);
    element.dispatchEvent(event);
  }
  init();
})();
