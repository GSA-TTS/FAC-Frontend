describe('Accessibility', () => {
  const pages = [
    '/',
    '/audit/new/step-1',
    '/audit/new/step-2',
    '/audit/new/step-3',
    '/audit/submission',
    '/audit/submission/awards',
    '/submissions',
  ];
  it('should get a perfect Lighthouse score for accessibility on every page', () => {
    pages.forEach((page) => {
      cy.visit(page);
      cy.lighthouse({
        accessibility: 100,
      });
    });
  });
});
