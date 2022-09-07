import { getApiToken } from './auth';

(function () {
  console.log('audit-submissions called.');
  const ENDPOINT = '/submissions';
  const apiUrl = 'https://fac-dev.app.cloud.gov';

  const TEST_ROWS = 29; // TEST switch (Set to 0 to exit test mode)
  let itemObjArray = [];
  let currentPage;

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
    const paginationID = 'subPagination';
    const TotalItems = itemObjArray.length;
    const ITEMS_PER_PAGE = 3;
    const TotalPages = Math.ceil(TotalItems / ITEMS_PER_PAGE);
    console.log('Total number of pages: ' + TotalPages);

    if (TotalPages > 0) {
      buildTable('audit-submissions', itemObjArray);
      initPagination(paginationID, TotalPages);
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
    // if TotalPages > 1
    updatePagination(paginationID, TP, currentPage);
    // else DEFAULT
    // Hide
  }

  function updatePagination(paginationID, TP, CP) {
    console.log('updatePagination called.');
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
        console.log(key, value);
        let pButton = pButtons[key];
        console.log(pButton);

        pButton.removeAttribute('role');
        pButton.removeAttribute('aria-label');

        if (value == '...') {
          pButton.innerHTML = '<span>…</span>';
          pButton.classList.replace(
            'usa-pagination__page-no',
            'usa-pagination__overflow'
          );
          pButton.setAttribute('role', 'presentation');
        } else if (value == TP) {
          pButton.innerHTML = TP;
          pButton.classList.replace(
            'usa-pagination__overflow',
            'usa-pagination__page-no'
          );
          pButton.setAttribute('aria-label', 'Page ' + TP);
        } else {
          // Update Attributes
          pButton.innerHTML = value;
          pButton.classList.replace(
            'usa-pagination__overflow',
            'usa-pagination__page-no'
          );
          pButton.setAttribute('aria-label', 'Page ' + value);
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

  function createPattern(TotalPages, currentPage) {
    let array_buttons = [];
    if (TotalPages > 7) {
      // currentPage determines pattern
      if (currentPage < 5) {
        // (1)(2)(3)(4)5...TotalPages
        for (let i = 0; i < 5; i++) {
          array_buttons.push(i + 1);
        }
        array_buttons.push('...');
        array_buttons.push(TotalPages);
      } else if (currentPage > TotalPages - 4) {
        // 1...TotalPages-4(TotalPages-3)(TotalPages-2)(TotalPages-1)(TotalPages)
        array_buttons.push(1);
        array_buttons.push('...');
        for (let i = TotalPages - 5; i < TotalPages; i++) {
          array_buttons.push(i + 1);
        }
      } else {
        // 1...currentPage-1(currentPage)currentPage+1...TotalPages
        array_buttons.push(1);
        array_buttons.push('...');
        for (let i = currentPage - 1; i < currentPage + 2; i++) {
          array_buttons.push(i);
        }
        array_buttons.push('...');
        array_buttons.push(TotalPages);
      }
    } else {
      for (let i = 0; i < TotalPages; i++) {
        array_buttons.push(i + 1);
      }
    }
    return array_buttons;
  }

  function init() {
    getSubmissions();
  }

  init();
})();
