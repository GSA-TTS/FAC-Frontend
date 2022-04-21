describe('Create New Audit', () => {
  before(() => {
    cy.visit("/audit/new/");
  })

  describe('A Blank Form', () => {
    it('marks empty responses as invalid', () => {
      cy.get('fieldset.question:invalid').should('have.length', 3);
    })

    it('will not submit', () => {
      cy.get('.usa-form--large').invoke('submit', (e) => {
        e.preventDefault()
        throw new Error('Form was submitted'); // The test will fail if this error is thrown
      })

      cy.get('.usa-button').contains('Continue').click();
    });

    it('sets focus on the first invalid input', () => {
      cy.get('.usa-button').contains('Continue').click();
      cy.focused().should('have.attr', 'type', 'radio');
    })
  })
})
