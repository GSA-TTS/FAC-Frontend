import { getApiToken } from './auth';

(function () {
  console.log('audit-submissions called.');
  const ENDPOINT = '/submissions';
  const apiUrl = 'https://fac-dev.app.cloud.gov';

  let itemObjArray = [];
  let currentPage = 1;

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
    if (
      data['detail'] == 'Invalid token.' ||
      data['detail'] == 'Token expired!'
    ) {
      handleErrorResponse(data);
      return;
    }
    console.log(data);
    itemObjArray = createTestData(numRows);
    createTable('audit-submissions', itemObjArray);
    const numberOfItems = itemObjArray.length;
    const numberPerPage = 3;
    const TotalPages = Math.ceil(numberOfItems / numberPerPage);
    console.log('numberOfPages: ' + TotalPages);
  }

  function handleErrorResponse(data) {
    console.log('ERROR: Failed to retrieve submissions.');
    console.log(data);
  }

  function createTable(tableId, data) {
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

  // Pagination
  // TEST DATA
  let numRows = 29;
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

  let button_pattern = createPattern(TotalPages, currentPage);
  console.log(button_pattern);

  function init() {
    getSubmissions();
  }

  init();
})();
