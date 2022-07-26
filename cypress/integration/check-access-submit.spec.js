describe('Create New Audit', () => {
  before(() => {
    cy.visit('/audit/new/step-3');
  });

  describe('Fill out form', () => {
    it('does not show any errors initially', () => {
      cy.get('[class*=--error]').should('have.length', 0);
    });

    describe('Auditee certifying official', () => {
      it('fill in Auditee contact fields', () => {
        cy.get('#auditee_certifying_official_email')
          .clear()
          .type('test.address-with+features@test.gsa.gov')
          .blur();
        cy.get('#auditee_certifying_official_re_email')
          .clear()
          .type('test.address-with+features@test.gsa.gov')
          .blur();
      });
    });

    describe('Auditor certifying official', () => {
      it('fill in Auditor contact fields', () => {
        cy.get('#auditor_certifying_official_email')
          .clear()
          .type('test.address-with+features@test.gsa.gov')
          .blur();
        cy.get('#auditor_certifying_official_re_email')
          .clear()
          .type('test.address-with+features@test.gsa.gov')
          .blur();
      });
    });

    describe('Auditee contacts', () => {
      it('fill in inital contact fields', () => {
        cy.get('#auditee_contacts_email')
          .clear()
          .type('test.address-with+features@test.gsa.gov')
          .blur();
        cy.get('#auditee_contacts_re_email')
          .clear()
          .type('test.address-with+features@test.gsa.gov')
          .blur();
      });
      it('should be able to add contact and contact info to new inputs', () => {
        cy.get('.auditee_contacts').within(() => {
          cy.get('button').click();
          cy.get('.grid-row').should('have.length', 2);
          cy.get('input[id*="auditee_contacts_email"]')
            .eq(1)
            .clear()
            .type('test.address-with+features@test.gsa.gov');
          cy.get('input[id*="auditee_contacts_re_email"]')
            .eq(1)
            .clear()
            .type('test.address-with+features@test.gsa.gov');
        });
      });
    });
    describe('auditor contacts', () => {
      it('fill in inital contact fields', () => {
        cy.get('#auditor_contacts_email')
          .clear()
          .type('test.address-with+features@test.gsa.gov')
          .blur();
        cy.get('#auditor_contacts_re_email')
          .clear()
          .type('test.address-with+features@test.gsa.gov')
          .blur();
      });
      it('should be able to add contact and contact info to new inputs', () => {
        cy.get('.auditor_contacts').within(() => {
          cy.get('button').click();
          cy.get('.grid-row').should('have.length', 2);
          cy.get('input[id*="auditor_contacts_email"]')
            .eq(1)
            .clear()
            .type('test.address-with+features@test.gsa.gov');
          cy.get('input[id*="auditor_contacts_re_email"]')
            .eq(1)
            .clear()
            .type('test.address-with+features@test.gsa.gov');
        });
      });
    });
  });

  describe('Test form submission', () => {
    it('should return errors from the remote server', () => {
      cy.intercept('POST', '/sac/accessandsubmission', {
        next: '',
        errors: true,
      }).as('invalidResponse');

      cy.get('.usa-button').contains('Create').click();

      cy.wait('@invalidResponse').then((interception) => {
        assert.isTrue(
          interception.response.body.errors,
          'Failure API Response'
        );
        console.log('Response:' + interception.response.body.errors);
      });
    });

    it('should return success response and move to the next page', () => {
      cy.intercept('POST', '/sac/accessandsubmission', {
        next: 'TBD',
        errors: false,
      }).as('validResponse');

      cy.get('.usa-button').contains('Create').click();

      cy.wait('@validResponse').then((interception) => {
        assert.isFalse(
          interception.response.body.errors,
          'Succcessful API Response'
        );
        console.log('Response:' + interception.response.body.next);
      });
      cy.url().should('include', 'submission');
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
