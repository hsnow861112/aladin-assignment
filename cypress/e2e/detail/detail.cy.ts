describe('사용자 상세', () => {
	it('검색 후 카드 클릭 시, detail-user API 응답이 카드에 제대로 노출된다', () => {
		cy.visit('/');

		cy.intercept('**/api/search-users*').as('searchApi');
		cy.intercept('**/api/detail-user*').as('detailApi');

		cy.get('[data-testid="search-input"]').click().type('asdf', { delay: 200 }).type('{enter}');

		cy.wait('@searchApi', { timeout: 20000 });

		cy.get('[data-testid="user-card"]').should('have.length.gt', 0);

		cy.get('[data-testid="user-card"]').first().click();

		cy.wait('@detailApi', { timeout: 20000 }).then(({ response }) => {
			const detail = response?.body;

			expect(detail, 'detail-user 응답 본문').to.exist;

			expect(detail?.error, 'detail-user API error').to.be.undefined;

			cy.contains(detail.login).should('exist');
			cy.contains(`id: ${detail.id}`).should('exist');
			cy.contains(`name: ${detail.name ?? ''}`).should('exist');
			cy.contains(`user_view_type: ${detail.user_view_type}`).should('exist');
			cy.contains(`followers: ${detail.followers}`).should('exist');
			cy.contains(`following: ${detail.following}`).should('exist');
			cy.contains(`public_repos: ${detail.public_repos}`).should('exist');
			cy.contains(`public_gists: ${detail.public_gists}`).should('exist');
			cy.contains(`created_at: ${detail.created_at}`).should('exist');
			cy.contains(`updated_at: ${detail.updated_at}`).should('exist');
			cy.contains(`url: ${detail.url}`).should('exist');
		});
	});
});
