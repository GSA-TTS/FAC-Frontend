describe('Display my audit submissions', () => {
  before(() => {
    cy.visit('/submissions');
  });

  describe('Do not display if user has no submissions', () => {
    it('does not display the submissions table', () => {
      cy.intercept(
        {
          method: 'GET',
          url: 'https://fac-dev.app.cloud.gov/submissions',
        },
        []
      ).as('submissionsRequest');

      cy.wait('@submissionsRequest').then((interception) => {
        console.log(interception);
        interception.response.body.should('have.length', 0);
      });
    });
  });
});
