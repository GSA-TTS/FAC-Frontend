import Alpine from 'alpinejs';
import { queryAPI } from './api';

window.Alpine = Alpine;
Alpine.store('report', {
  init() {
    fetchReport();
  },
});
Alpine.start();

function prepareData(data) {
  data.multiple_eins_covered = data.multiple_eins_covered.toString();
  data.multiple_ueis_covered = data.multiple_ueis_covered.toString();
  return data;
}

function fetchReport() {
  const params = new URLSearchParams(window.location.search);
  const reportId = params.get('reportId');
  if (!reportId) return;

  queryAPI(`/sac/edit/${reportId}`, undefined, {}, [
    function (data) {
      const report = prepareData(data);
      console.log(report);
      Alpine.store('report', { ...report });
    },
    function (error) {
      console.error(error);
    },
  ]);
}
