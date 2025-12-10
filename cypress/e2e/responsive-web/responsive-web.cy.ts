describe('Responsive user grid columns', () => {
	const assertGridColumns = (expected: number) => {
		cy.get('[data-testid="user-grid"]').should($el => {
			const el = $el[0] as HTMLElement;
			const win = el.ownerDocument.defaultView!;
			const template = win.getComputedStyle(el).gridTemplateColumns;

			const beforeSlash = template.split('/')[0].trim();

			const count = beforeSlash === 'none' ? 0 : beforeSlash.split(/\s+/).filter(Boolean).length;

			expect(count, `grid-template-columns count (template="${template}")`).to.eq(expected);
		});
	};

	it('viewport별로 grid 컬럼 수가 1/2/3/4로 반응형 동작한다', () => {
		cy.visit('/');

		cy.intercept('**/api/search-users*').as('searchApi');

		cy.get('[data-testid="search-input"]').click().type('asdf', { delay: 100 }).type('{enter}');

		cy.wait('@searchApi', { timeout: 20000 });

		cy.get('[data-testid="user-card"]').should('have.length.gt', 0);

		cy.viewport(375, 812);
		cy.wait(1000);
		assertGridColumns(1);

		cy.viewport(800, 900);
		cy.wait(1000);
		assertGridColumns(2);

		cy.viewport(1024, 900);
		cy.wait(1000);
		assertGridColumns(3);

		cy.viewport(1280, 900);
		cy.wait(1000);
		assertGridColumns(4);
	});
});
