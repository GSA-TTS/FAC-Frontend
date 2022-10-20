import { getApiToken } from './auth';
export default () => ({
  submissions: null,
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
          return data;
        })
        .catch((e) => {
          console.log(e);
        });
    });
    if (data.length > 0) {
      data.forEach((d, i) => (d.id = i));
      this.submissions = data;
      this.$nextTick(() => {
        tableElement.querySelector('#report_id button').click();
      });
      tableElement.classList.remove('display-none');
    } else {
      console.log('No submissions. Table not displayed.');
    }
  },
  get pagedSubmissions() {
    if (this.submissions) {
      return this.submissions;
    } else return [];
  },
});
