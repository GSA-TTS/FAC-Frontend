describe('Create New Audit', () => {
  before(() => {
    cy.visit('/audit/new/step-2');
  });

  describe('Prepopulate the form', () => {
    it('does not show any errors initially', () => {
      cy.get('[class*=--error]').should('have.length', 0);
    });

    describe('ADD Auditee UEID', () => {
      it('should add auditee UEID and confirm auditee UEID', () => {
        cy.get('#auditee_ueid').clear().type('ZQGGHJH74DW7').blur();
        cy.get('#confirm_auditee_ueid').clear().type('ZQGGHJH74DW7').blur();
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

        cy.get('button').contains('Validate UEI').click();

        cy.wait('@validUeiRequest').then((interception) => {
          assert.isNotNull(interception.response.body, '1st API call has data');
        });

        cy.get('#uei-error-message li').should('have.length', 0);
        cy.get('#auditee_name').should(
          'have.value',
          'INTERNATIONAL BUSINESS MACHINES CORPORATION'
        );
      });
    });

    describe('ADD Fiscal Year', () => {
      it('should not show an error if the user enters a date after 12/31/2019', () => {
        cy.get('#auditee_fy_start_date_start').clear().type('12/31/2020');
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
      //cy.get('#eligibility-error-message li').should('have.length', 2);
    });

    it('should return success response and move to the next page', () => {
      cy.intercept('POST', '/sac/auditee', {
        validueid: true,
        next: 'sac/access',
      }).as('validResponse');

      cy.get('.usa-button').contains('Continue').click();

      cy.wait('@validResponse').then((interception) => {
        assert.isTrue(
          interception.response.body.validueid,
          'Succcessful API Response'
        );
        console.log('Response:' + interception.response.body.validueid);
      });
      /*
      cy.get('.usa-step-indicator__segment--current').contains(
        'Audit submission access'
      );
      */
      cy.url().should('include', 'step-3');
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
