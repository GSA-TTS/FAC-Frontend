import { queryAPI } from './api';

function handleMySubmissionsResponse(data) {
  console.log(data);
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
