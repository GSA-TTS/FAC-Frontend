import { getApiToken } from './auth';

(function () {
  console.log('audit-submissions called.');
  const ENDPOINT = '/submissions';

  const apiUrl = 'https://fac-dev.app.cloud.gov';

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
/*
    queryAPI(
      ENDPOINT,
      null,
      {
        method: 'HEAD',
      },
      [handleSubmissionsResponse, handleErrorResponse]
    );
*/
  }

  function handleSubmissionsResponse(data) {
    console.log('SUCCESS');
    console.log(data);
  }
  function handleErrorResponse(data) {
    console.log('ERROR: Failed to retrieve submissions.');
    console.log(data);
  }

  function init() {
    getSubmissions();
  }

  init();
})();
