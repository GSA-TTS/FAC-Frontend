describe('My audit submissions', () => {
  before(() => {
    cy.visit('/submissions');
  });

  describe('Accessibility', () => {
    it('should get a perfect Lighthouse score for accessibility', () => {
      cy.lighthouse({
        accessibility: 100,
      });
    });
  });
});
