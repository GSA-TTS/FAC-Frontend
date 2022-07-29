import { queryAPI } from './api';

const my_unpublished_audit_submissions_table_headers = [
  'Report ID',
  'Status',
  'Auditee UEI',
  'Auditee name',
  'Fiscal year end date',
];

const constructTableHeaders = () => {
  const tableHeader = document.createElement('thead');
  const tableHeadRow = document.createElement('tr');

  for (const header of my_unpublished_audit_submissions_table_headers) {
    tableHeadRow.innerHTML += `<th data-sortable scope="col" role="columnheader">${header}</th>`;
  }
  tableHeader.appendChild(tableHeadRow);

  return tableHeader;
};

const constructTableBody = (submissionsData) => {
  const tableBody = document.createElement('tbody');
  const tableBodyRow = document.createElement('tr');

  for (const submission of submissionsData) {
    for (const value of Object.values(submission)) {
      tableBodyRow.innerHTML += `<td data-sort-value=${value}> ${value} </td>`;
    }
    tableBody.appendChild(tableBodyRow);
  }

  return tableBody;
};

const constructTableContainer = () => {
  const tableDiv = document.createElement('div');
  tableDiv.innerHTML = `
    <div class="margin-top-4">
      <h2 class="text-base-darker ">My unpublished audit submission list</h2>
      <div class="usa-table-container">
      <table class="usa-table">
        <caption></caption>
      </table>
      <div class="usa-sr-only usa-table__announcement-region" aria-live="polite"></div>
    </div>
    </div>`;

  return tableDiv;
};

function handleMySubmissionsResponse(data) {
  if (data.length > 0) {
    const tableHeader = constructTableHeaders();
    const tableBody = constructTableBody(data);
    const tableContainer = constructTableContainer();

    const container = document.querySelector(
      '#my-unpublished-audits-container'
    );

    container.appendChild(tableContainer);
    document.querySelector('table').appendChild(tableHeader);
    document.querySelector('table').appendChild(tableBody);
  }
}

function handleApiError(e) {
  console.error(e);
}

function getMySubmissions() {
  queryAPI(
    '/submissions',
    null,
    {
      method: 'GET',
    },
    [handleMySubmissionsResponse, handleApiError]
  );
}

function init() {
  getMySubmissions();
}

init();
