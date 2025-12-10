describe('GitHub 검색 – SSR/CSR 경계 (초기 빈 상태 + CSR 검색)', () => {
	it('초기 SSR 렌더에서는 빈 상태만 보이고, CSR 검색 이후에만 결과가 렌더된다', () => {
		cy.intercept('GET', '**/api/search-users*').as('search');

		cy.visit('/');

		cy.contains('조회된 결과가 없습니다.').should('be.visible');
		cy.get('[data-testid="user-card"]').should('have.length', 0);

		cy.get('[data-testid="search-input"]').click().type('asdf', { delay: 200 }).type('{enter}');

		cy.wait('@search', { timeout: 20000 });

		cy.get('[data-testid="user-card"]', { timeout: 30000 }).should('have.length.greaterThan', 0);
		cy.contains('조회된 결과가 없습니다.').should('not.exist');
	});
});
