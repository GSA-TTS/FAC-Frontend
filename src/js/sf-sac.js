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

function attachEventHandlers() {
  window.addEventListener('scroll', highlightActiveNavSection);
}

function init() {
  attachEventHandlers();
}

init();
