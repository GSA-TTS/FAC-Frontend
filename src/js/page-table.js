import { getApiToken } from './auth';
export default () => ({
  TEST_ROWS: 47, // TEST switch (Set to 0 to exit test mode);
  PAGE_SIZE: 3,
  current_page: 1,
  total_pages: 1,
  submissions: null,
  sortCol: null,
  sortAsc: true,

  async init() {
    const tableElement = this.$el;
    const headers = new Headers();
    headers.append('Content-type', 'application/json');
    let data = await getApiToken().then((token) => {
      headers.append('Authorization', 'Token ' + token); // authToken is set in a script tag right before this script loads
      return fetch(`https://fac-dev.app.cloud.gov/submissions`, {
        method: 'GET',
        headers: headers,
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          return data;
        })
        .catch((e) => {
          console.log(e);
        });
    });
    //data = this.createTestData(this.TEST_ROWS);
    if (data.length > 0) {
      data.forEach((d, i) => (d.id = i));
      this.submissions = data;
      let totalSubmissions = this.submissions.length;
      this.total_pages = Math.ceil(totalSubmissions / this.PAGE_SIZE);
      let arrTh = tableElement.getElementsByTagName('th');
      for (const th of arrTh) {
        let sortButton = th.getElementsByTagName('button');
        let buttonChildren = sortButton[0].children;
        for (var i = 0; i < buttonChildren.length; i++) {
          buttonChildren[i].style.pointerEvents = 'none';
        }
        sortButton[0].setAttribute('x-on:click', 'sort');
      }
      window.addEventListener('alpine-next-page', () => {
        this.nextPage();
      });
      window.addEventListener('alpine-prev-page', () => {
        this.previousPage();
      });
      window.addEventListener('alpine-update-page', (e) => {
        this.updatePage(e);
      });
      const tableLoadedEvent = new CustomEvent('alpine-submissions-loaded', {
        detail: {
          total_pages: this.total_pages,
        },
      });
      window.dispatchEvent(tableLoadedEvent);
      tableElement.classList.remove('display-none');
      console.log('table inited');
    } else {
      console.log('No submissions. Table not displayed.');
    }
  },
  nextPage() {
    console.log('PAGINATION: Next Page.');
    if (this.current_page < this.total_pages) this.current_page++;
  },
  previousPage() {
    console.log('PAGINATION: Prev Page.');
    if (this.current_page > 1) this.current_page--;
  },
  updatePage(e) {
    // stuff
    console.log('page-table');
    console.log(e.target.getAttribute('value'));
    this.current_page = e.target.getAttribute('value');
  },
  sort(e) {
    let this_th = e.target.parentElement;
    let col = this_th.getAttribute('id');
    if (col) {
      const arrTh = document.getElementsByTagName('th');
      for (const th of arrTh) {
        th.removeAttribute('aria-sort');
      }
      if (this.sortCol === col) this.sortAsc = !this.sortAsc;
      this.sortCol = col;
      const sortDir = this.sortAsc == true ? 'descending' : 'ascending';
      this_th.setAttribute('aria-sort', sortDir);
      this.submissions.sort((a, b) => {
        if (a[this.sortCol] < b[this.sortCol]) return this.sortAsc ? 1 : -1;
        if (a[this.sortCol] > b[this.sortCol]) return this.sortAsc ? -1 : 1;
        return 0;
      });
    }
  },
  createTestData(numRows) {
    console.log('createTestData called.');
    let objArray = [];
    for (let i = 0; i < numRows; i++) {
      let j = i + 1;
      let report_id_data = String(j).padStart(17, '0');
      let submission_status_data = 'In progress';
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
    console.log(objArray.length);
    return objArray;
  },
  get pagedSubmissions() {
    console.log('paged called.');
    if (this.submissions) {
      return this.submissions.filter((row, index) => {
        let start = (this.current_page - 1) * this.PAGE_SIZE;
        let end = this.current_page * this.PAGE_SIZE;
        if (index >= start && index < end) return true;
      });
    } else return [];
  },
});
