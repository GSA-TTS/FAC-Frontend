describe('My submissions', () => {
  before(() => {
    cy.visit('/audit/submissions');
  });

  describe('A Blank Form', () => {
    it('does not show any errors initially', () => {
      cy.get('[class*=--error]').should('have.length', 0);
    });

    it('will not submit', () => {
      cy.get('[data-cy="submit"]').click();

      cy.url().should('include', '/audit/submissions/');
    });
  });

  describe('Validation', () => {
    it('should display error messages for invalid entities', () => {
      cy.get('[data-cy="submit"]').click();

      cy.get('.usa-error-message:visible').should('have.length', 1);
    });

    it('should remove errors when valid properties are checked', () => {
      // This needs to be a click on the label rather than a
      // check on the input itself because of the CSS magic
      // USWDS does to make the fancy radio buttons

      // Click twice to trigger the blur event,
      // or in the case of a checkbox, click the `next` element

      cy.get('label[for=confirm-terms-checkbox]').click();
      cy.get('[data-cy="confirm-terms-checkbox"').blur();

      cy.get('.usa-checkbox.usa-form-group--error').should('have.length', 0);
    });
  });

  describe('Accessibility', () => {
    it('should get a perfect Lighthouse score for accessibility', () => {
      cy.lighthouse({
        accessibility: 100,
      });
    });
  });
});
