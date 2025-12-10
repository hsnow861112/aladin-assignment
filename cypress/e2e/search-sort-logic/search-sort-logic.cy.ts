describe('상세 검색 전체 조건 + 개수 20 + 팔로워 정렬', () => {
	it('상세 검색을 꽉 채워서 검색하면 URL 쿼리스트링이 기대값과 일치한다', () => {
		const expectedQ =
			'asdf' +
			'+type:user' +
			'+repos:10..50' +
			'+location:Seoul' +
			'+language:typescript' +
			'+created:2023-01-01..2025-12-10' +
			'+followers:5..20' +
			'+sponsorable:true';

		cy.intercept('GET', '**/api/search-users*').as('search');

		cy.visit('/');

		cy.contains('label', '개수').parent().find('[role="combobox"]').click();
		cy.get('ul[role="listbox"]').contains('20').click();

		cy.contains('label', '정렬').parent().find('[role="combobox"]').click();
		cy.get('ul[role="listbox"]').contains('followers').click();

		cy.get('[data-testid="search-input"]').type('asdf');

		cy.get('[data-testid="search-input"]').closest('div').find('button').last().click();

		cy.contains('label', 'Type').parent().find('[role="combobox"]').click();
		cy.get('ul[role="listbox"]').contains('User').click();

		cy.contains('label', 'Repo Min').parent().find('input[type="number"]').type('{selectall}10');
		cy.contains('label', 'Repo Max').parent().find('input[type="number"]').type('{selectall}50');

		cy.contains('label', 'Location').parent().find('input').clear().type('Seoul');

		cy.contains('label', 'Language').parent().find('[role="combobox"]').click();
		cy.get('ul[role="listbox"]').contains('TypeScript').click();

		cy.contains('label', 'Created From').parent().find('input').clear().type('2023-01-01');

		cy.contains('label', 'Created To').parent().find('input').clear().type('2025-12-10');

		cy.contains('label', 'Followers Min').parent().find('input[type="number"]').type('{selectall}5');
		cy.contains('label', 'Followers Max').parent().find('input[type="number"]').type('{selectall}20');

		cy.contains('label', 'Only sponsorable').click();

		cy.contains('button', '검색').click();

		cy.wait('@search', { timeout: 20000 }).then(({ request, response }) => {
			const url = new URL(request.url);
			const q = url.searchParams.get('q') ?? '';
			const page = url.searchParams.get('page');
			const perPage = url.searchParams.get('perPage');
			const sort = url.searchParams.get('sort');
			const order = url.searchParams.get('order');

			expect(q).to.eq(expectedQ);
			expect(page).to.eq('1');
			expect(perPage).to.eq('20');
			expect(sort).to.eq('followers');
			expect(order).to.eq('desc');

			expect(response?.statusCode).to.eq(200);
		});
	});
});
