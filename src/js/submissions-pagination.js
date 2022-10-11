export default () => ({
  current_page: 1,
  total_pages: 1,

  init() {
    window.addEventListener('alpine-submissions-loaded', (e) => {
      console.log('PAGINATION: submissions loaded call received.');
      console.log(e.detail.total_pages);
      this.total_pages = e.detail.total_pages;
      this.initPagination('submissionsPagination', this.total_pages);
    });
    window.addEventListener('alpine-next-page', () => {
      this.nextPage();
    });
    window.addEventListener('alpine-prev-page', () => {
      this.previousPage();
    });
    window.addEventListener('alpine-update-page', (e) => {
      this.updatePage(e);
    });
  },
  nextPage() {
    console.log('PAGINATION: Next Page.');
    if (this.current_page < this.total_pages) this.current_page++;
    this.updatePagination(
      'submissionsPagination',
      this.total_pages,
      this.current_page
    );
  },
  previousPage() {
    console.log('PAGINATION: Prev Page.');
    if (this.current_page > 1) this.current_page--;
    this.updatePagination(
      'submissionsPagination',
      this.total_pages,
      this.current_page
    );
  },
  updatePage(e) {
    console.log('PAGINATION: updatePage called.');
    this.current_page = e.target.getAttribute('value');
    console.log(this.current_page);
    this.updatePagination(
      'submissionsPagination',
      this.total_pages,
      this.current_page
    );
  },
  initPagination(paginationID, TP) {
    this.current_page = 1;
    // remove buttons if TP less than 7
    if (TP < 7) {
      const Pagination_Block = document.getElementById(paginationID);
      const toRemove = 7 - TP;
      let buttonsArr = Array.from(Pagination_Block.getElementsByTagName('li'));
      buttonsArr.shift();
      buttonsArr.pop();
      for (let i = 0; i < toRemove; i++) {
        buttonsArr[i].parentNode.removeChild(buttonsArr[i]);
      }
    }
    this.updatePagination(paginationID, TP, this.current_page);
    const buttons_PrevNext = Array.from(
      document.getElementsByClassName('usa-pagination__link')
    );
    buttons_PrevNext.forEach(function (item) {
      item.addEventListener('click', this.updatePage, false);
    });
  },
  createPattern(total_pages, current_page) {
    let TP = Number(total_pages);
    let CP = Number(current_page);
    let array_buttons = [];
    if (TP > 7) {
      // current_page determines pattern
      if (CP < 5) {
        // (1)(2)(3)(4)5...total_pages
        for (let i = 0; i < 5; i++) {
          array_buttons.push(i + 1);
        }
        array_buttons.push('...');
        array_buttons.push(TP);
      } else if (CP > TP - 4) {
        // 1...total_pages-4(total_pages-3)(total_pages-2)(total_pages-1)(total_pages)
        array_buttons.push(1);
        array_buttons.push('...');
        for (let i = TP - 5; i < TP; i++) {
          array_buttons.push(i + 1);
        }
      } else {
        // 1...current_page-1(current_page)current_page+1...total_pages
        array_buttons.push(1);
        array_buttons.push('...');
        for (let i = CP - 1; i < 2 + CP; i++) {
          array_buttons.push(i);
        }
        array_buttons.push('...');
        array_buttons.push(TP);
      }
    } else {
      for (let i = 0; i < TP; i++) {
        array_buttons.push(i + 1);
      }
    }
    return array_buttons;
  },
  updatePagination(pagination_id, total_pages, current_page) {
    const pid = pagination_id;
    const tp = total_pages;
    const cp = current_page;
    const Pagination_Block = document.getElementById(pid);
    const button_previous = Pagination_Block.getElementsByClassName(
      'usa-pagination__arrow'
    )[0];
    const button_next = Pagination_Block.getElementsByClassName(
      'usa-pagination__arrow'
    )[1];

    if (Pagination_Block.offsetParent != null) {
      Pagination_Block.classList.add('display-none');
      Pagination_Block.setAttribute('aria-hidden', true);
    }

    button_previous.classList.remove('display-none');
    button_previous.removeAttribute('aria-hidden', true);
    button_next.classList.remove('display-none');
    button_next.removeAttribute('aria-hidden', true);

    if (tp > 1 && cp <= tp) {
      button_previous.setAttribute('value', cp - 1);
      button_previous.setAttribute(
        'x-on:click',
        '$dispatch("alpine-prev-page")'
      );

      button_next.setAttribute('value', Number(cp) + 1);
      button_next.setAttribute('x-on:click', '$dispatch("alpine-next-page")');

      const button_pattern = this.createPattern(tp, cp);
      let buttonsArr = Array.from(Pagination_Block.getElementsByTagName('li'));
      buttonsArr.shift();
      buttonsArr.pop();

      for (const [key, value] of Object.entries(button_pattern)) {
        const pButtonLi = buttonsArr[key];
        pButtonLi.innerHTML = '';
        pButtonLi.classList.remove('usa-pagination__overflow');
        pButtonLi.classList.remove('usa-pagination__page-no');
        pButtonLi.removeAttribute('role');
        pButtonLi.removeAttribute('aria-label');
        if (value == '...') {
          //console.log('...4');
          pButtonLi.innerHTML = '<span>...</span>';
          pButtonLi.classList.add('usa-pagination__overflow');
          pButtonLi.setAttribute('role', 'presentation');
        } else {
          const pageNum = value;
          const pButtonLink = document.createElement('a');
          pButtonLink.innerHTML = pageNum;
          pButtonLink.classList.add('usa-pagination__button');
          pButtonLink.setAttribute('aria-label', 'Page ' + pageNum);
          pButtonLink.setAttribute('href', 'javascript:void(0);');
          pButtonLink.setAttribute('value', pageNum);
          pButtonLink.setAttribute(
            'x-on:click',
            '$dispatch("alpine-update-page")'
          );
          if (pageNum == cp) {
            pButtonLink.classList.add('usa-current');
          }
          pButtonLi.appendChild(pButtonLink);
          pButtonLi.classList.add('usa-pagination__page-no');
        }
      }

      if (cp == 1) {
        button_previous.classList.add('display-none');
        button_previous.setAttribute('aria-hidden', true);
      } else if (cp == tp) {
        button_next.classList.add('display-none');
        button_next.setAttribute('aria-hidden', true);
      }

      Pagination_Block.classList.remove('display-none');
      Pagination_Block.removeAttribute('aria-hidden');
    }
  },
});
