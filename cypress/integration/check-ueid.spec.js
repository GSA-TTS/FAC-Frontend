describe('Create New Audit', () => {
  before(() => {
    cy.visit('/audit/new/step-2');
  });

  describe('A Blank Form', () => {
    it('marks empty responses as invalid', () => {
      cy.get('.auditee-information input:invalid').should('have.length', 3);
    });

    it('will not submit', () => {
      cy.get('.usa-form--large').invoke('submit', (e) => {
        e.preventDefault();
        throw new Error('Form was submitted'); // The test will fail if this error is thrown
      });

      cy.get('.usa-button').contains('Continue').click();
    });
  });

  describe('Validation', () => {
    it('does not show any errors initially', () => {
      cy.get('[class*=--error]').should('have.length', 0);
    });

    it('should mark errors when invalid properties are checked', () => {
      cy.get('#auditee_ueid').click().blur();
      cy.get('#confirm_auditee_ueid').click().blur();
      cy.get('#auditee_name').click().blur();
      cy.get('[class*=usa-form-group--error]').should('have.length', 3);
    });

    describe('Auditee UEID', () => {
      it('should display an error message when left blank', () => {
        cy.get('#auditee_ueid').click().blur();
        cy.get('#auditee_ueid-not-null').should('be.visible');
      });

      it('should disable the submit button when fields are invalid', () => {
        cy.get('button').contains('Continue').should('be.disabled');
      });

      it('should remove the error message when input is supplied', () => {
        cy.get('#auditee_ueid').type('ASDF').blur();
        cy.get('#auditee_ueid-not-null').should('not.be.visible');
      });

      it('should indicate when the supplied input is too short', () => {
        cy.get('#auditee_ueid-length').should('be.visible');
      });

      it('should indicate when the supplied input is too long', () => {
        cy.get('#auditee_ueid').clear().type('ASDFASDFASDFA').blur();
        cy.get('#auditee_ueid-length').should('be.visible');
      });

      it('should remove the error message when the input is correct', () => {
        cy.get('#auditee_ueid').clear().type('ASDFASDFASDF').blur();
        cy.get('#auditee_ueid-length').should('not.be.visible');
      });

      it('should enable the "Continue" button when entities are fixed', () => {
        cy.get('button').contains('Continue').should('not.be.disabled');
      });
    });

    describe('Auditee UEID Confirmation', () => {
      it('should display an error message when input does not match UEID field', () => {
        cy.get('#confirm_auditee_ueid').type('ASDF').blur();
        cy.get('#confirm_auditee_ueid-must-match').should('be.visible');
      });

      it('should remove the error message when input matches UEID field', () => {
        cy.get('#confirm_auditee_ueid').type('ASDFASDF').blur();
        cy.get('#confirm_auditee_ueid-must-match').should('not.be.visible');
      });
    });

    describe('Auditee Name', () => {
      it('should display an error message when left blank', () => {
        cy.get('#auditee_name').click().blur();
        cy.get('#auditee_name-not-null').should('be.visible');
      });

      it('should remove the error message when input is supplied', () => {
        cy.get('#auditee_name').type('Thurgood Marshall').blur();
        cy.get('#auditee_name-not-null').should('not.be.visible');
      });
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
