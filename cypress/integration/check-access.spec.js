describe('Create New Audit', () => {
  before(() => {
    cy.visit('/audit/new/step-3');
  });

  describe('A Blank Form', () => {
    it('marks empty responses as invalid', () => {
      cy.get('#grant-access input:invalid').should('have.length', 12);
    });

    it('will not submit', () => {
      cy.get('form#grant-access').invoke('submit', (e) => {
        e.preventDefault();
        throw new Error('Form was submitted'); // The test will fail if this error is thrown
      });

      cy.get('button').contains('Create').click();
    });
  });

  describe('Validation', () => {
    it('does not show any errors initially', () => {
      cy.get('[class*=--error]').should('have.length', 0);
    });

    describe('Auditee certifying official', () => {
      describe('Name', () => {
        it('should display an error message when left blank', () => {
          cy.get('#auditee_certifying_official_name').click().blur();
          cy.get('#auditee_certifying_official_name-not-null').should(
            'be.visible'
          );
        });

        it('should disable the submit button when fields are invalid', () => {
          cy.get('button').contains('Create').should('be.disabled');
        });

        it('should remove the error message when input is supplied', () => {
          cy.get('#auditee_certifying_official_name')
            .clear()
            .type('A Name')
            .blur();
          cy.get('#auditee_certifying_official_name-not-null').should(
            'not.be.visible'
          );
        });

        it('should enable the "Create" button when entities are fixed', () => {
          cy.get('button').contains('Create').should('not.be.disabled');
        });
      });

      describe('Email Address', () => {
        it('should display an error message when left blank', () => {
          cy.get('#auditee_certifying_official_email').click().blur();
          cy.get('#auditee_certifying_official_email-not-null').should(
            'be.visible'
          );
        });

        it('should disable the submit button when fields are left blank', () => {
          cy.get('button').contains('Create').should('be.disabled');
        });

        it('should remove the error message when input is supplied', () => {
          cy.get('#auditee_certifying_official_email')
            .clear()
            .type('A Name')
            .blur();
          cy.get('#auditee_certifying_official_email-not-null').should(
            'not.be.visible'
          );
        });

        it('should display an error message when entry is invalid', () => {
          cy.get('#auditee_certifying_official_email').click().blur();
          cy.get('#auditee_certifying_official_email-email').should(
            'be.visible'
          );
        });

        it('should disable the submit button when fields are invalid', () => {
          cy.get('button').contains('Create').should('be.disabled');
        });

        it('should remove the error message when valid input is supplied', () => {
          cy.get('#auditee_certifying_official_email')
            .clear()
            .type('test.address-with+features@test.gsa.gov')
            .blur();
          cy.get('#auditee_certifying_official_email-email').should(
            'not.be.visible'
          );
        });

        it('should enable the "Create" button when entities are fixed', () => {
          cy.get('button').contains('Create').should('not.be.disabled');
        });
      });

      describe('Email Address Confirmation', () => {
        it('should display an error message when input does not match email field', () => {
          cy.get('#auditee_certifying_official_email')
            .clear()
            .type('test.address-with+features@test.gsa.gov')
            .blur();
          cy.get('#auditee_certifying_official_re_email')
            .clear()
            .type('test.address-wit')
            .blur();
          cy.get('#auditee_certifying_official_re_email-must-match').should(
            'be.visible'
          );
        });

        it('should remove the error message when input matches email field', () => {
          cy.get('#auditee_certifying_official_email')
            .clear()
            .type('test.address-with+features@test.gsa.gov')
            .blur();
          cy.get('#auditee_certifying_official_re_email')
            .clear()
            .type('test.address-with+features@test.gsa.gov')
            .blur();
          cy.get('#auditee_certifying_official_re_email-must-match').should(
            'not.be.visible'
          );
        });
      });
    });

    describe('Auditor certifying official', () => {
      describe('Name', () => {
        it('should display an error message when left blank', () => {
          cy.get('#auditor_certifying_official_name').click().blur();
          cy.get('#auditor_certifying_official_name-not-null').should(
            'be.visible'
          );
        });

        it('should disable the submit button when fields are invalid', () => {
          cy.get('button').contains('Create').should('be.disabled');
        });

        it('should remove the error message when input is supplied', () => {
          cy.get('#auditor_certifying_official_name')
            .clear()
            .type('A Name')
            .blur();
          cy.get('#auditor_certifying_official_name-not-null').should(
            'not.be.visible'
          );
        });

        it('should enable the "Create" button when entities are fixed', () => {
          cy.get('button').contains('Create').should('not.be.disabled');
        });
      });

      describe('Email Address', () => {
        it('should display an error message when left blank', () => {
          cy.get('#auditor_certifying_official_email').click().blur();
          cy.get('#auditor_certifying_official_email-not-null').should(
            'be.visible'
          );
        });

        it('should disable the submit button when fields are left blank', () => {
          cy.get('button').contains('Create').should('be.disabled');
        });

        it('should remove the error message when input is supplied', () => {
          cy.get('#auditor_certifying_official_email')
            .clear()
            .type('A Name')
            .blur();
          cy.get('#auditor_certifying_official_email-not-null').should(
            'not.be.visible'
          );
        });

        it('should display an error message when entry is invalid', () => {
          cy.get('#auditor_certifying_official_email').click().blur();
          cy.get('#auditor_certifying_official_email-email').should(
            'be.visible'
          );
        });

        it('should disable the submit button when fields are invalid', () => {
          cy.get('button').contains('Create').should('be.disabled');
        });

        it('should remove the error message when valid input is supplied', () => {
          cy.get('#auditor_certifying_official_email')
            .clear()
            .type('test.address-with+features@test.gsa.gov')
            .blur();
          cy.get('#auditor_certifying_official_email-email').should(
            'not.be.visible'
          );
        });

        it('should enable the "Create" button when entities are fixed', () => {
          cy.get('button').contains('Create').should('not.be.disabled');
        });
      });

      describe('Email Address Confirmation', () => {
        it('should display an error message when input does not match email field', () => {
          cy.get('#auditor_certifying_official_email')
            .clear()
            .type('test.address-with+features@test.gsa.gov')
            .blur();
          cy.get('#auditor_certifying_official_re_email')
            .clear()
            .type('test.address-wit')
            .blur();
          cy.get('#auditor_certifying_official_re_email-must-match').should(
            'be.visible'
          );
        });

        it('should remove the error message when input matches email field', () => {
          cy.get('#auditor_certifying_official_email')
            .clear()
            .type('test.address-with+features@test.gsa.gov')
            .blur();
          cy.get('#auditor_certifying_official_re_email')
            .clear()
            .type('test.address-with+features@test.gsa.gov')
            .blur();
          cy.get('#auditor_certifying_official_re_email-must-match').should(
            'not.be.visible'
          );
        });
      });
    });

    describe('Auditee contacts', () => {
      describe('Name', () => {
        it('should display an error message when left blank', () => {
          cy.get('#auditee_contacts_name').click().blur();
          cy.get('#auditee_contacts_name-not-null').should('be.visible');
        });

        it('should disable the submit button when fields are invalid', () => {
          cy.get('button').contains('Create').should('be.disabled');
        });

        it('should remove the error message when input is supplied', () => {
          cy.get('#auditee_contacts_name').clear().type('A Name').blur();
          cy.get('#auditee_contacts_name-not-null').should('not.be.visible');
        });

        it('should enable the "Create" button when entities are fixed', () => {
          cy.get('button').contains('Create').should('not.be.disabled');
        });
      });

      describe('Email Address', () => {
        it('should display an error message when left blank', () => {
          cy.get('#auditee_contacts_email').click().blur();
          cy.get('#auditee_contacts_email-not-null').should('be.visible');
        });

        it('should disable the submit button when fields are left blank', () => {
          cy.get('button').contains('Create').should('be.disabled');
        });

        it('should remove the error message when input is supplied', () => {
          cy.get('#auditee_contacts_email').clear().type('A Name').blur();
          cy.get('#auditee_contacts_email-not-null').should('not.be.visible');
        });

        it('should display an error message when entry is invalid', () => {
          cy.get('#auditee_contacts_email').click().blur();
          cy.get('#auditee_contacts_email-email').should('be.visible');
        });

        it('should disable the submit button when fields are invalid', () => {
          cy.get('button').contains('Create').should('be.disabled');
        });

        it('should remove the error message when valid input is supplied', () => {
          cy.get('#auditee_contacts_email')
            .clear()
            .type('test.address-with+features@test.gsa.gov')
            .blur();
          cy.get('#auditee_contacts_email-email').should('not.be.visible');
        });

        it('should enable the "Create" button when entities are fixed', () => {
          cy.get('button').contains('Create').should('not.be.disabled');
        });
      });

      describe('Email Address Confirmation', () => {
        it('should display an error message when input does not match email field', () => {
          cy.get('#auditee_contacts_email')
            .clear()
            .type('test.address-with+features@test.gsa.gov')
            .blur();
          cy.get('#auditee_contacts_re_email')
            .clear()
            .type('test.address-wit')
            .blur();
          cy.get('#auditee_contacts_re_email-must-match').should('be.visible');
        });

        it('should remove the error message when input matches email field', () => {
          cy.get('#auditee_contacts_email')
            .clear()
            .type('test.address-with+features@test.gsa.gov')
            .blur();
          cy.get('#auditee_contacts_re_email')
            .clear()
            .type('test.address-with+features@test.gsa.gov')
            .blur();
          cy.get('#auditee_contacts_re_email-must-match').should(
            'not.be.visible'
          );
        });
      });
    });

    describe('Auditor contacts', () => {
      describe('Name', () => {
        it('should display an error message when left blank', () => {
          cy.get('#auditor_contacts_name').click().blur();
          cy.get('#auditor_contacts_name-not-null').should('be.visible');
        });

        it('should disable the submit button when fields are invalid', () => {
          cy.get('button').contains('Create').should('be.disabled');
        });

        it('should remove the error message when input is supplied', () => {
          cy.get('#auditor_contacts_name').clear().type('A Name').blur();
          cy.get('#auditor_contacts_name-not-null').should('not.be.visible');
        });

        it('should enable the "Create" button when entities are fixed', () => {
          cy.get('button').contains('Create').should('not.be.disabled');
        });
      });

      describe('Email Address', () => {
        it('should display an error message when left blank', () => {
          cy.get('#auditor_contacts_email').click().blur();
          cy.get('#auditor_contacts_email-not-null').should('be.visible');
        });

        it('should disable the submit button when fields are left blank', () => {
          cy.get('button').contains('Create').should('be.disabled');
        });

        it('should remove the error message when input is supplied', () => {
          cy.get('#auditor_contacts_email').clear().type('A Name').blur();
          cy.get('#auditor_contacts_email-not-null').should('not.be.visible');
        });

        it('should display an error message when entry is invalid', () => {
          cy.get('#auditor_contacts_email').click().blur();
          cy.get('#auditor_contacts_email-email').should('be.visible');
        });

        it('should disable the submit button when fields are invalid', () => {
          cy.get('button').contains('Create').should('be.disabled');
        });

        it('should remove the error message when valid input is supplied', () => {
          cy.get('#auditor_contacts_email')
            .clear()
            .type('test.address-with+features@test.gsa.gov')
            .blur();
          cy.get('#auditor_contacts_email-email').should('not.be.visible');
        });

        it('should enable the "Create" button when entities are fixed', () => {
          cy.get('button').contains('Create').should('not.be.disabled');
        });
      });

      describe('Email Address Confirmation', () => {
        it('should display an error message when input does not match email field', () => {
          cy.get('#auditor_contacts_email')
            .clear()
            .type('test.address-with+features@test.gsa.gov')
            .blur();
          cy.get('#auditor_contacts_re_email')
            .clear()
            .type('test.address-wit')
            .blur();
          cy.get('#auditor_contacts_re_email-must-match').should('be.visible');
        });

        it('should remove the error message when input matches email field', () => {
          cy.get('#auditor_contacts_email')
            .clear()
            .type('test.address-with+features@test.gsa.gov')
            .blur();
          cy.get('#auditor_contacts_re_email')
            .clear()
            .type('test.address-with+features@test.gsa.gov')
            .blur();
          cy.get('#auditor_contacts_re_email-must-match').should(
            'not.be.visible'
          );
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
