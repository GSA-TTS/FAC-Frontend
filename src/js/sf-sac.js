function highlightActiveNavSection() {
  let currentFieldsetId;

  const fieldsets = document.querySelectorAll('fieldset[id]');
  const navLinks = document.querySelectorAll('.usa-sidenav__item a');

  fieldsets.forEach((f) => {
    const fieldsetTop = f.offsetTop;
    if (scrollY >= fieldsetTop) {
      currentFieldsetId = f.id;
    }
  });

  navLinks.forEach((l) => {
    if (currentFieldsetId) {
      l.parentElement.classList.remove('usa-current');
    }

    if (l.getAttribute('href') == `#${currentFieldsetId}`) {
      l.parentElement.classList.add('usa-current');
    }
  });
}

function attachEventHandlers() {
  window.addEventListener('scroll', highlightActiveNavSection);
}

function init() {
  attachEventHandlers();
}

init();
