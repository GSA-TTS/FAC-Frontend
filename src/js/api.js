export const queryAPI = (
  endpoint,
  data,
  config,
  [handleResponse, handleError]
) => {
  const apiUrl = 'https://fac-dev.app.cloud.gov';
  const headers = new Headers();

  headers.append('Authorization', 'Basic ' + config.authToken); // authToken is set in a script tag right before this script loads
  headers.append('Content-type', 'application/json');

  fetch(apiUrl + endpoint, {
    method: config.method,
    headers: headers,
    body: JSON.stringify(data),
  })
    .then((resp) => resp.json())
    .then((data) => handleResponse(data))
    .catch((e) => handleError(e));
};
