import Alpine from 'alpinejs';
import { queryAPI } from './api';
import submissionsTable from './page-table.js';

window.Alpine = Alpine;
Alpine.data('submissionsTable', submissionsTable);

Alpine.store('report', {
  init() {
    fetchReport();
  },
});
Alpine.start();

function prepareData(data) {
  data.multiple_eins_covered =
    data.multiple_eins_covered != null
      ? data.multiple_ueis_covered.toString()
      : '';
  data.multiple_ueis_covered =
    data.multiple_ueis_covered != null
      ? data.multiple_ueis_covered.toString()
      : '';
  return data;
}

function fetchReport() {
  const params = new URLSearchParams(window.location.search);
  const reportId = params.get('reportId');
  if (!reportId) return;

  queryAPI(`/sac/edit/${reportId}`, undefined, {}, [
    function (data) {
      const report = prepareData(data);
      Alpine.store('report', { ...report });
    },
    function (error) {
      console.error(error);
    },
  ]);
}
