describe('Create New Audit', () => {
  before(() => {
    cy.visit('/audit/new/step-2');
  });

  describe('Prepopulate the form', () => {
    it('does not show any errors initially', () => {
      cy.get('[class*=--error]').should('have.length', 0);
    });

    describe('Add Auditee UEID', () => {
      it('should add auditee UEI', () => {
        cy.get('#auditee_uei').clear().type('ZQGGHJH74DW7').blur();
      });
    });

    describe('ADD Auditee Name as part of UEI Validation via API', () => {
      it('shows entity name after valid UEI request', () => {
        cy.intercept(
          {
            method: 'POST', // Route all GET requests
            url: '/sac/ueivalidation', // that have a URL that matches '/users/*'
          },
          {
            valid: true,
            response: {
              uei: 'ZQGGHJH74DW7',
              auditee_name: 'INTERNATIONAL BUSINESS MACHINES CORPORATION',
            },
          }
        ).as('validUeiRequest');

        cy.get('#auditee_uei-btn').click();

        cy.wait('@validUeiRequest').then((interception) => {
          assert.isNotNull(interception.response.body, '1st API call has data');
        });

        cy.get('.usa-modal__footer button.primary').as('primaryButton').click();

        cy.get('#uei-error-message li').should('have.length', 0);
        cy.get('#auditee_name').should(
          'have.value',
          'INTERNATIONAL BUSINESS MACHINES CORPORATION'
        );
      });
    });

    describe('ADD Fiscal start/end dates', () => {
      it('Enter expected start date', () => {
        cy.get('#auditee_fiscal_period_start').clear().type('01/01/2021');
        cy.get('#fy-error-message li').should('have.length', 0);
      });
      it('Enter expected end date', () => {
        cy.get('#auditee_fiscal_period_end').clear().type('01/01/2022');
        cy.get('#fy-error-message li').should('have.length', 0);
      });
    });
  });

  describe('Auditee info validation via API', () => {
    it('should return auditee info errors from the remote server', () => {
      cy.intercept('POST', '/sac/auditee', {
        validueid: false,
        errors: 'Not valid.',
      }).as('invalidResponse');

      cy.get('.usa-button').contains('Continue').click();

      cy.wait('@invalidResponse').then((interception) => {
        assert.isFalse(
          interception.response.body.validueid,
          'Failure API Response'
        );
        console.log('Response:' + interception.response.body.validueid);
      });
    });

    it('should return success response and move to the next page', () => {
      cy.intercept('POST', '/sac/auditee', {
        validueid: true,
        next: '/sac/accessandsubmission',
      }).as('validResponse');

      cy.get('.usa-button').contains('Continue').click();

      cy.wait('@validResponse').then((interception) => {
        assert.isTrue(
          interception.response.body.validueid,
          'Succcessful API Response'
        );
        console.log('Response:' + interception.response.body.validueid);
      });
      cy.url().should('include', '/audit/new/step-3/');
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
