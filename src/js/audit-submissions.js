import { getApiToken } from './auth';

(function () {
  console.log('audit-submissions called.');
  const ENDPOINT = '/submissions';
  const apiUrl = 'https://fac-dev.app.cloud.gov';

  const TEST_ROWS = 29; // TEST switch (Set to 0 to exit test mode)
  const ITEMS_PER_PAGE = 3;
  let itemObjArray = [];
  let currentPage;
  let paginationID;
  let totalPages;

  function getSubmissions() {
    const headers = new Headers();
    headers.append('Content-type', 'application/json');

    getApiToken().then((token) => {
      headers.append('Authorization', 'Token ' + token); // authToken is set in a script tag right before this script loads

      fetch(apiUrl + ENDPOINT, {
        method: 'GET',
        headers: headers,
      })
        .then((resp) => resp.json())
        .then((data) => handleSubmissionsResponse(data))
        .catch((e) => handleErrorResponse(e));
    });
  }

  function handleSubmissionsResponse(data) {
    itemObjArray = Array.from(data);
    // TESTING
    // Test mode switch
    if (TEST_ROWS > 0) {
      itemObjArray = createTestData(TEST_ROWS);
    }

    paginationID = 'subPagination';
    const TotalItems = itemObjArray.length;
    totalPages = Math.ceil(TotalItems / ITEMS_PER_PAGE);

    if (totalPages > 0) {
      buildTable('audit-submissions', itemObjArray.slice(0, ITEMS_PER_PAGE));
      initPagination(paginationID, totalPages);
    } else {
      // Show 'No Results' message
    }
  }

  function handleErrorResponse(data) {
    console.log('ERROR: Failed to retrieve submissions.');
    console.log(data);
  }

  // TEST DATA
  function createTestData(numRows) {
    let objArray = [];
    for (let i = 0; i < numRows; i++) {
      let j = i + 1;
      let report_id_data = String(j).padStart(17, '0');
      let submission_status_data = 'in_progress';
      let auditee_uei_data = String(j * 15).padStart(12, '0');
      let auditee_fiscal_period_end_data =
        '2022-01-' + String(j).padStart(2, '0');
      let auditee_name_data = 'Entity Num ' + j;
      let itemObj = {
        report_id: report_id_data,
        submission_status: submission_status_data,
        auditee_uei: auditee_uei_data,
        auditee_fiscal_period_end: auditee_fiscal_period_end_data,
        auditee_name: auditee_name_data,
      };
      objArray.push(itemObj);
    }
    return objArray;
  }

  function initPagination(paginationID, TP) {
    currentPage = 1;
    updatePagination(paginationID, TP, currentPage);
    const buttons_PrevNext = Array.from(
      document.getElementsByClassName('usa-pagination__link')
    );
    buttons_PrevNext.forEach(function (item) {
      item.addEventListener('click', pageClick, false);
    });
  }

  function updatePagination(pagination_id, total_pages, current_page) {
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
      const button_pattern = createPattern(tp, cp);
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

          if (pageNum == cp) {
            pButtonLink.classList.add('usa-current');
          }

          pButtonLink.addEventListener('click', pageClick, false);

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
  }

  function buildTable(tableId, data) {
    const subTable = document.getElementById(tableId);
    const tBody = subTable.getElementsByTagName('tbody')[0];
    tBody.innerHTML = '';
    for (let key in data) {
      const newRow = tBody.insertRow(-1);
      let unsortedData = data[key];
      let sortedData = JSON.parse(
        JSON.stringify(
          unsortedData,
          [
            'report_id',
            'submission_status',
            'auditee_uei',
            'auditee_name',
            'auditee_fiscal_period_end',
          ],
          4
        )
      );

      for (let cellKey in sortedData) {
        let newCell;
        switch (cellKey) {
          case 'report_id':
            newCell = document.createElement('th');
            newCell.setAttribute('scope', 'row');
            newCell.setAttribute('role', 'rowheader');
            newCell.setAttribute('data-sort-active', 'true');
            newCell.innerHTML = data[key][cellKey];
            newRow.appendChild(newCell);
            break;
          case 'auditee_fiscal_period_end':
            newCell = newRow.insertCell(-1);
            newCell.innerHTML = new Date(data[key][cellKey]).toLocaleDateString(
              'en-us',
              {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }
            );
            newRow.appendChild(newCell);
            break;
          default:
            newCell = newRow.insertCell(-1);
            newCell.innerHTML = data[key][cellKey];
        }
      }
    }
  }

  function createPattern(totalPages, currentPage) {
    let TP = Number(totalPages);
    let CP = Number(currentPage);
    let array_buttons = [];
    if (TP > 7) {
      // currentPage determines pattern
      if (CP < 5) {
        // (1)(2)(3)(4)5...totalPages
        for (let i = 0; i < 5; i++) {
          array_buttons.push(i + 1);
        }
        array_buttons.push('...');
        array_buttons.push(TP);
      } else if (CP > TP - 4) {
        // 1...totalPages-4(totalPages-3)(totalPages-2)(totalPages-1)(totalPages)
        array_buttons.push(1);
        array_buttons.push('...');
        for (let i = TP - 5; i < TP; i++) {
          array_buttons.push(i + 1);
        }
      } else {
        // 1...currentPage-1(currentPage)currentPage+1...totalPages
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
  }

  function pageClick() {
    let pageClicked;
    if (this.classList.contains('usa-pagination__previous-page')) {
      pageClicked = Number(currentPage) - 1;
    } else if (this.classList.contains('usa-pagination__next-page')) {
      pageClicked = Number(currentPage) + 1;
    } else {
      pageClicked = Number(this.innerHTML);
    }
    const sliceStart = ITEMS_PER_PAGE * (pageClicked - 1);
    const sliceEnd = ITEMS_PER_PAGE * pageClicked;
    const pageData = itemObjArray.slice(sliceStart, sliceEnd);
    currentPage = pageClicked;
    updatePagination(paginationID, totalPages, currentPage);
    buildTable('audit-submissions', pageData);
  }

  function init() {
    getSubmissions();
  }

  init();
})();
