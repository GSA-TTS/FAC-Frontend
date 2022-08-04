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

    describe('Auditee UEID', () => {
      it('should display an error message when left blank', () => {
        cy.get('#auditee_uei').click().blur();
        cy.get('#auditee_uei-not-null').should('be.visible');
      });

      it('should disable the submit button when fields are invalid', () => {
        cy.get('button').contains('Continue').should('be.disabled');
      });

      it('should remove the error message when input is supplied', () => {
        cy.get('#auditee_uei').type('ASDF').blur();
        cy.get('#auditee_uei-not-null').should('not.be.visible');
      });

      it('should indicate when the supplied input is too short', () => {
        cy.get('#auditee_uei-length').should('be.visible');
      });

      it('should indicate when the supplied input is too long', () => {
        cy.get('#auditee_uei').clear().type('ASDFASDFASDFA').blur();
        cy.get('#auditee_uei-length').should('be.visible');
      });

      it('should remove the error message when the input is correct', () => {
        cy.get('#auditee_uei').clear().type('ASDFASDFASDF').blur();
        cy.get('#auditee_uei-length').should('not.be.visible');
      });

      it('should enable the "Continue" button when entities are fixed', () => {
        cy.get('button').contains('Continue').should('not.be.disabled');
      });
    });

    describe('Fiscal Year Validation', () => {
      it('should show an error if the user enters a date before 1/1/2020', () => {
        cy.get('#auditee_fiscal_period_start').type('12/31/2019');
        cy.get('#fy-error-message li').should('have.length', 1);
      });

      it('should not show an error if the user enters a date after 12/31/2019', () => {
        cy.get('#auditee_fiscal_period_start').clear().type('12/31/2020');
        cy.get('#fy-error-message li').should('have.length', 0);
      });
    });

    describe('UEI Validation via API', () => {
      beforeEach(() => {
        cy.get('#auditee_uei-btn').as('searchButton');
        cy.get('.usa-modal__footer button.primary').as('primaryButton');
        cy.get('.usa-modal__footer button.secondary').as('secondaryButton');
      });

      afterEach(() => {
        cy.reload();
      });

      describe('Connection Errors', () => {
        beforeEach(() => {
          cy.intercept(
            {
              method: 'POST', // Route all GET requests
              url: '/sac/ueivalidation', // that have a URL that matches '/users/*'
            },
            {
              statusCode: 500,
            }
          ).as('apiError');
        });

        it('handles API errors', () => {
          cy.get('@searchButton').click();

          cy.wait('@apiError').then((interception) => {
            assert.isNotNull(
              interception.response.body,
              '1st API call has data'
            );
          });

          cy.contains(`We can't connect to SAM.gov to confirm your UEI.`);
        });

        it('lets the user proceed without a UEI', () => {
          cy.get('@searchButton').click();

          cy.wait('@apiError').then((interception) => {
            assert.isNotNull(
              interception.response.body,
              '1st API call has data'
            );
          });

          cy.get('@secondaryButton').click();
          cy.get('#no-uei-warning').should('be.visible');
          cy.get('#auditee_uei').should('not.be.visible');
        });
      });

      describe('An invalid UEI', () => {
        beforeEach(() => {
          cy.intercept(
            {
              method: 'POST',
              url: '/sac/ueivalidation',
            },
            {
              valid: false,
              errors: {
                auditee_uei: [
                  'The letters “O” and “I” are not used to avoid confusion with zero and one.',
                  'Ensure this field has at least 12 characters.',
                ],
              },
            }
          ).as('invalidUeiRequest');
        });

        it('Lets users know when their UEI is not recognized', () => {
          cy.get('@searchButton').click();

          cy.wait('@invalidUeiRequest').then((interception) => {
            assert.isNotNull(
              interception.response.body,
              '1st API call has data'
            );
          });

          cy.contains('Your UEI is not recognized');
        });

        it('lets the user proceed without a UEI', () => {
          cy.get('@searchButton').click();

          cy.wait('@invalidUeiRequest').then((interception) => {
            assert.isNotNull(
              interception.response.body,
              '1st API call has data'
            );
          });

          cy.get('@primaryButton').click();
          cy.get('#no-uei-warning').should('be.visible');
          cy.get('#auditee_uei').should('not.be.visible');
        });
      });

      describe('A successful lookup', () => {
        beforeEach(() => {
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
        });

        it('shows entity name after valid UEI request', () => {
          cy.get('@searchButton').click();

          cy.wait('@validUeiRequest').then((interception) => {
            assert.isNotNull(
              interception.response.body,
              '1st API call has data'
            );
          });

          cy.get('#uei-error-message li').should('have.length', 0);
          cy.get('#auditee_name').should(
            'have.value',
            'INTERNATIONAL BUSINESS MACHINES CORPORATION'
          );
        });

        it('Shows UEI and name in the page and hides the search field', () => {
          cy.get('@searchButton').click();

          cy.wait('@validUeiRequest').then((interception) => {
            assert.isNotNull(
              interception.response.body,
              '1st API call has data'
            );
          });

          cy.get('@primaryButton').click();
          cy.get('#auditee_uei').should('not.be.visible');
          cy.get('[data-testid=uei-info]').should('be.visible');
        });
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
