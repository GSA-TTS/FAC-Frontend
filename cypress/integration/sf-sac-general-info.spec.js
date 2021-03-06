describe('Create New Audit', () => {
  const CONTINUE_BUTTON_TEXT = 'Save & continue to next section';

  before(() => {
    cy.visit('/audit/submission');
  });

  describe('A Blank Form', () => {
    it('does not show any errors initially', () => {
      cy.get('[class*=--error]').should('have.length', 0);
    });

    it('marks empty responses as invalid', () => {
      cy.get('#general-info input:invalid').should('have.length', 10);
    });

    it('will not submit', () => {
      cy.get('#general-info').invoke('submit', (e) => {
        e.preventDefault();
        throw new Error('Form was submitted'); // The test will fail if this error is thrown
      });

      cy.get('.usa-button').contains(CONTINUE_BUTTON_TEXT).click();
    });

    it('should disable the "Continue" button when validation fails', () => {
      cy.get('button').contains(CONTINUE_BUTTON_TEXT).should('be.disabled');
    });
  });

  describe('Validation', () => {
    it('should display error messages for invalid entities', () => {
      cy.get('.usa-error-message:visible').should('have.length', 16);
    });

    it('should remove errors when valid properties are checked', () => {
      // This needs to be a click on the label rather than a
      // check on the input itself because of the CSS magic
      // USWDS does to make the fancy radio buttons

      // Click twice to trigger the blur event,
      // or in the case of a checkbox, click the `next` element

      cy.get('label[for=audit-type-single]').click();
      cy.get('label[for=audit-type-single]').click();

      cy.get('label[for=audit-period-annual]').click();
      cy.get('label[for=audit-period-annual]').click();

      cy.get('label[for=ein-not-ssn]').click();
      cy.get('label[for=ein-not-ssn]').next().click();

      cy.get('label[for=multiple-eins-yes]').click();
      cy.get('label[for=multiple-eins-yes]').click();

      cy.get('label[for=multiple-ueis-yes]').click();
      cy.get('label[for=multiple-ueis-yes]').click();

      cy.get('label[for=auditor-ein-not-ssn]').click();
      cy.get('label[for=auditor-ein-not-ssn]').next().click();

      cy.get('.radio.usa-form-group--error').should('have.length', 0);
      cy.get('.usa-checkbox.usa-form-group--error').should('have.length', 0);
    });

    it('should remove errors when text fields have text in them', () => {
      cy.get('.usa-input:not(.radio):not(.usa-checkbox):not([disabled])').each(
        (i) => {
          cy.get(i).type('asdf');
        }
      );
      cy.get('label[for=auditor-telephone]').click();
      cy.get('.usa-checkbox.usa-form-group--error').should('have.length', 0);
    });

    it('should enable the "Continue" button when entities are fixed', () => {
      cy.get('button').contains(CONTINUE_BUTTON_TEXT).should('not.be.disabled');
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
