import { getApiToken } from './auth';

(function () {
  console.log('audit-submissions called.');
  const ENDPOINT = '/submissions';
  const apiUrl = 'https://fac-dev.app.cloud.gov';

  const TEST_ROWS = 29; // TEST switch (Set to 0 to exit test mode)
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
    console.log(data);

    // TESTING
    // Check if logged in (For testing)
    if (
      data['detail'] == 'Invalid token.' ||
      data['detail'] == 'Token expired!'
    ) {
      handleErrorResponse(data);
      return;
    }

    // TESTING
    // Test mode switch
    if (TEST_ROWS > 0) {
      itemObjArray = createTestData(TEST_ROWS);
    }

    // Set VARs
    paginationID = 'subPagination';
    const TotalItems = itemObjArray.length;
    const ITEMS_PER_PAGE = 3;
    totalPages = Math.ceil(TotalItems / ITEMS_PER_PAGE);
    console.log('Total number of pages: ' + totalPages);

    if (totalPages > 0) {
      buildTable('audit-submissions', itemObjArray);
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

  // INIT Pagination
  function initPagination(paginationID, TP) {
    currentPage = 1;
    updatePagination(paginationID, TP, currentPage);
  }

  function updatePagination(paginationID, TP, CP) {
    console.log('updatePagination called.');
    console.log(paginationID);
    console.log(TP);
    console.log(CP);
    const Pagination_Block = document.getElementById(paginationID);
    console.log(Pagination_Block);
    // Check TP
    if (TP > 1 && CP <= TP) {
      let button_pattern = createPattern(TP, CP);
      console.log(button_pattern);
      // GET LIs
      let pButtons = Array.from(Pagination_Block.getElementsByTagName('li'));
      pButtons.shift();
      pButtons.pop();
      console.log(pButtons);

      // HIDE pagination NAV
      if (Pagination_Block.offsetParent != null) {
        Pagination_Block.classList.add('display-none');
        Pagination_Block.setAttribute('aria-hidden', true);
      }

      // Loop through buttons abd match the pattern
      for (const [key, value] of Object.entries(button_pattern)) {
        console.log('button_pattern[key][value]:' + key, value);
        // GET button
        let pButton = pButtons[key];
        console.log(pButton);
        pButton.innerHTML = '';
        pButton.removeAttribute('role');
        pButton.removeAttribute('aria-label');

        if (value == '...') {
          // Add ellipsis
          pButton.innerHTML = '<span>…</span>';
          // Update LI classes
          pButton.classList.replace(
            'usa-pagination__page-no',
            'usa-pagination__overflow'
          );
          pButton.setAttribute('role', 'presentation');
        } else {
          let pageNum = value;
          // Create link element
          const pButtonLink = document.createElement('a');
          // Update link
          pButtonLink.innerHTML = pageNum;
          pButtonLink.classList.add('usa-pagination__button');
          pButtonLink.setAttribute('aria-label', 'Page ' + pageNum);
          pButtonLink.setAttribute('href', 'javascript:void(0);');

          if (pageNum == CP) {
            pButtonLink.classList.add('usa-current');
          }
          pButtonLink.addEventListener('click', pageClick, false);

          // Attach link
          pButton.appendChild(pButtonLink);
          // Update LI classes
          pButton.classList.replace(
            'usa-pagination__overflow',
            'usa-pagination__page-no'
          );
        }
      }

      // Enable/disable Previous and Next buttons
      if (CP == 1) {
        // Disable Previous
        let button_previous = Pagination_Block.getElementsByClassName(
          'usa-pagination__arrow'
        )[0];
        button_previous.classList.add('display-none');
        button_previous.setAttribute('aria-hidden', true);
      } else if (CP == TP) {
        // Disable Next
        let button_next = Pagination_Block.getElementsByClassName(
          'usa-pagination__arrow'
        )[1];
        button_next.classList.add('display-none');
        button_next.setAttribute('aria-hidden', true);
      }
      // SHOW pagination NAV (targetContainer)
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
            //'version',
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
    let pageClicked = this.innerHTML;
    console.log(pageClicked);
    currentPage = pageClicked;
    updatePagination(paginationID, totalPages, currentPage);
  }

  function init() {
    getSubmissions();
  }

  init();
})();
