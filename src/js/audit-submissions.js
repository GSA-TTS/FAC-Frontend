(function () {
  function init() {
    const submissions_table = document.getElementById('audit-submissions');
    const uei_link = submissions_table.querySelector('th .usa-link');
    uei_link.setAttribute('href', '#modal-uei-info');
    uei_link.setAttribute('aria-controls', 'modal-uei-info');
    uei_link.setAttribute('data-open-modal', '');

    const button_group = document.querySelector(
      '#modal-uei-info .usa-button-group'
    );
    const second_button = button_group.querySelectorAll(
      '.usa-button-group__item'
    )[1];
    second_button.remove();
  }
  init();
})();
