describe('Display my audit submissions', () => {
  before(() => {
    cy.visit('/submissions');
  });
  describe('On correct page.', () => {
    it('should have correct title', () => {
      cy.get('h1').should('have.text', 'My audit submissions');
    });
  });

  describe('test Start new submission button', () => {
    it('should be disbaled to start', () => {
      cy.get('#start-submission').should('have.attr', 'disabled');
    });
    it('should be enabled when checkbox checked', () => {
      cy.get('#check-start-new-submission').click({ force: true });
      cy.get('#start-submission').should('not.have.attr', 'disabled');
    });
    it('should be disabled when checkbox unchecked', () => {
      cy.get('#check-start-new-submission').click({ force: true });
      cy.get('#start-submission').should('have.attr', 'disabled');
    });
    it('should navigate to first step in new submission process on click', () => {
      cy.get('#check-start-new-submission').click({ force: true });
      cy.get('#start-submission').click();
      cy.get('h1').should('have.text', 'Create new audit');
    });
  });

  describe('test terms and conditions modal trigger', () => {
    before(() => {
      cy.visit('/submissions');
    });
    it('should have the modal as hidden by default', () => {
      cy.get('#modal-terms-conditions').should('have.class', 'is-hidden');
    });
    it('should unhide the modal and close it', () => {
      cy.get('#terms-conditions-trigger').click();
      cy.get('#modal-terms-conditions').should('not.have.class', 'is-hidden');
      cy.get('#modal-terms-conditions .usa-modal__close').click();
      cy.get('#modal-terms-conditions').should('have.class', 'is-hidden');
    });
    it('should navigate to first step in new submission process', () => {
      cy.get('#terms-conditions-trigger').click();
      cy.get('#modal-terms-conditions').should('not.have.class', 'is-hidden');
      cy.get('#modal-terms-continue').click();
      cy.get('h1').should('have.text', 'Create new audit');
    });
  });
});
