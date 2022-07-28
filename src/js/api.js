import { getApiToken } from './auth';

export const queryAPI = (
  endpoint,
  data,
  config,
  [handleResponse, handleError]
) => {
  const apiUrl = 'https://fac-dev.app.cloud.gov';
  const headers = new Headers();

  headers.append('Content-type', 'application/json');

  getApiToken().then((token) => {
    headers.append('Authorization', 'Token ' + token); // authToken is set in a script tag right before this script loads

    fetch(apiUrl + endpoint, {
      method: config.method,
      headers: headers,
      body: data ? JSON.stringify(data) : undefined,
    })
      .then((resp) => resp.json())
      .then((data) => handleResponse(data))
      .catch((e) => handleError(e));
  });
};
