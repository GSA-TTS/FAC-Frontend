describe('My submissions', () => {
  const SUBMIT_BUTTON_TEXT = 'Start a new submission';

  before(() => {
    cy.visit('/audit/submissions');
  });

  describe('A Blank Form', () => {
    it('does not show any errors initially', () => {
      cy.get('[class*=--error]').should('have.length', 0);
    });

    it('will not submit', () => {
      cy.get('#start-new-submission').invoke('submit', (e) => {
        e.preventDefault();
        throw new Error('Form was submitted'); // The test will fail if this error is thrown
      });

      cy.get('.usa-button').contains(SUBMIT_BUTTON_TEXT).click();
    });
  });

  // describe('Validation', () => {
  //   it('should display error messages for invalid entities', () => {
  //     cy.get('.usa-error-message:visible').should('have.length', 1);
  //   });

  //   it('should remove errors when valid properties are checked', () => {
  //     // This needs to be a click on the label rather than a
  //     // check on the input itself because of the CSS magic
  //     // USWDS does to make the fancy radio buttons

  //     // Click twice to trigger the blur event,
  //     // or in the case of a checkbox, click the `next` element

  //     cy.get('label[for=confirm-terms-checkbox]').click();
  //     cy.get('label[for=confirm-terms-checkbox]').next().click();

  //     cy.get('.radio.usa-form-group--error').should('have.length', 0);
  //     cy.get('.usa-checkbox.usa-form-group--error').should('have.length', 0);
  //   });

  //   //   it('should enable the "Continue" button when entities are fixed', () => {
  //   //     cy.get('button').contains(CONTINUE_BUTTON_TEXT).should('not.be.disabled');
  //   //   });
  // });

  // describe('Accessibility', () => {
  //   it('should get a perfect Lighthouse score for accessibility', () => {
  //     cy.lighthouse({
  //       accessibility: 100,
  //     });
  //   });
  // });
});
