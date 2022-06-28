describe('Create New Audit', () => {
  before(() => {
    cy.visit('/audit/new/step-2');
  });

  describe('A Blank Form', () => {
    it('marks empty responses as invalid', () => {
      cy.get('.auditee-information input:invalid').should('have.length', 2);
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
      cy.get('[class*=usa-form-group--error]').should('have.length', 2);
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
      it('should enable the "Continue" button when entities are fixed', () => {
        cy.get('button').contains('Continue').should('not.be.disabled');
      });
    });

    describe('UEI Validation via API', () => {
      it('handles API errors', () => {
        cy.intercept(
          {
            method: 'POST', // Route all GET requests
            url: '/sac/ueivalidation', // that have a URL that matches '/users/*'
          },
          {
            statusCode: 500,
          }
        ).as('apiError');

        cy.get('button').contains('Validate UEI').click();

        cy.wait('@apiError').then((interception) => {
          assert.isNotNull(interception.response.body, '1st API call has data');
        });

        cy.get('#uei-error-message li').should('have.length', 1);
      });

      it('shows UEI errors from the remote server', () => {
        cy.intercept(
          {
            method: 'POST',
            url: '/sac/ueivalidation',
          },
          {
            valid: false,
            errors: {
              uei: [
                'The letters “O” and “I” are not used to avoid confusion with zero and one.',
                'Ensure this field has at least 12 characters.',
              ],
            },
          }
        ).as('invalidUeiRequest');

        cy.get('button').contains('Validate UEI').click();

        cy.wait('@invalidUeiRequest').then((interception) => {
          assert.isNotNull(interception.response.body, '1st API call has data');
        });

        cy.get('#uei-error-message li').should('have.length', 3);
      });

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

    describe('Fiscal Year Validation', () => {
      it('should show an error if the user enters a date before 1/1/2020', () => {
        cy.get('#auditee_fy_start_date_start').type('12/31/2019');
        cy.get('#fy-error-message li').should('have.length', 1);
      });

      it('should not show an error if the user enters a date after 12/31/2019', () => {
        cy.get('#auditee_fy_start_date_start').clear().type('12/31/2020');
        cy.get('#fy-error-message li').should('have.length', 0);
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
