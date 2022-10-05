describe('Display my audit submissions', () => {
  before(() => {
    cy.visit('/submissions');
  });

  describe('Do not display if user has no submissions', () => {
    it('does not display the submissions table', () => {
      cy.intercept(
        {
          method: 'GET', // Route all GET requests
          url: 'https://fac-dev.app.cloud.gov/submissions', // that have a URL that matches '/users/*'
        },
        {
          response: [
            {
              report_id: '2021FQF0001000003',
              submission_status: 'in_progress',
              auditee_uei: 'ZQGGHJH74DW7',
              auditee_fiscal_period_end: '2022-01-01',
              auditee_name: 'ibm',
            },
            {
              report_id: '20215L30001000005',
              submission_status: 'in_progress',
              auditee_uei: 'ZQGGHJH74DW7',
              auditee_fiscal_period_end: '2022-01-01',
              auditee_name: 'SubTest1',
            },
            {
              report_id: '2021JG70001000010',
              submission_status: 'in_progress',
              auditee_uei: 'ZQGGHJH74xW7',
              auditee_fiscal_period_end: '2022-01-01',
              auditee_name: 'INTERNATIONAL BUSINESS MACHINES CORPORATION',
            },
            {
              report_id: '2021E650001000011',
              submission_status: 'in_progress',
              auditee_uei: 'ZQGGHJH74xW7',
              auditee_fiscal_period_end: '2022-01-01',
              auditee_name: 'asd',
            },
            {
              report_id: '2021MCM0001000013',
              submission_status: 'in_progress',
              auditee_uei: 'ZQGGHJH74DW7',
              auditee_fiscal_period_end: '2022-01-01',
              auditee_name: null,
            },
            {
              report_id: '2021RFJ0001000014',
              submission_status: 'in_progress',
              auditee_uei: 'ZQGGHJH74DW7',
              auditee_fiscal_period_end: '2022-01-01',
              auditee_name: null,
            },
            {
              report_id: '2021WEU0001000015',
              submission_status: 'in_progress',
              auditee_uei: 'ZQGGHJH74DW7',
              auditee_fiscal_period_end: '2022-01-01',
              auditee_name: null,
            },
            {
              report_id: '2021BGX0001000016',
              submission_status: 'in_progress',
              auditee_uei: 'ZQGGHJH74DW7',
              auditee_fiscal_period_end: '2022-01-01',
              auditee_name: null,
            },
            {
              report_id: '20216KN0001000017',
              submission_status: 'in_progress',
              auditee_uei: 'ZQGGHJH74DW7',
              auditee_fiscal_period_end: '2021-11-01',
              auditee_name: null,
            },
          ],
        }
      ).as('submissionsRequest');

      cy.wait('@submissionsRequest').then((interception) => {
        assert.isNotNull(interception.response.body, '1st API call has data');
      });
    });
  });
});
