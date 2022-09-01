import Alpine from 'alpinejs';
import { queryAPI } from './api';

window.Alpine = Alpine;
Alpine.store('report', {
  init() {
    fetchReport();
  },
});
Alpine.start();

function fetchReport() {
  const params = new URLSearchParams(window.location.search);
  const reportId = params.get('reportId');
  if (!reportId) return;

  queryAPI(`/sac/edit/${reportId}`, undefined, {}, [
    function (data) {
      Alpine.store('report', { ...data });
    },
    function (error) {
      console.error(error);
    },
  ]);
}
