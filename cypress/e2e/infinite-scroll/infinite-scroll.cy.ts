describe('사용자 검색 무한 스크롤', () => {
	it('쿼터(limit) 소진 시 대기 후 재시도 및 전체 카드 개수 + 페이지 번호 검증', () => {
		cy.visit('/');

		cy.intercept('**/api/search-users*').as('api');

		cy.get('[data-testid="search-input"]').click().type('asdf', { delay: 200 }).type('{enter}');

		let totalLoadedCount = 0;
		let limit = 0;
		let currentPage = 0;

		const scrollAndAccumulate = () => {
			cy.wait(1000);

			cy.get('[data-testid="scroll-container"]').then($el => {
				const el = $el[0];
				cy.wrap($el).scrollTo(0, el.scrollHeight - el.clientHeight, { duration: 1000 });
			});

			cy.wait('@api', { timeout: 20000 }).then(({ request, response }) => {
				const url = new URL(request.url);
				const pageParam = url.searchParams.get('page');

				currentPage += 1;
				expect(pageParam).to.eq(String(currentPage));

				const body = response!.body;

				if (body.error === 'rate_limit') {
					const waitSeconds = body.wait ?? 5;

					cy.wait((waitSeconds + 2) * 1000);

					cy.wait('@api', { timeout: 20000 }).then(({ request: retryReq, response: retryResp }) => {
						const retryUrl = new URL(retryReq.url);
						const retryPageParam = retryUrl.searchParams.get('page');
						expect(retryPageParam).to.eq(String(currentPage));

						totalLoadedCount += (retryResp!.body.items || []).length;
					});
				} else {
					totalLoadedCount += (body.items || []).length;
				}
			});
		};

		cy.wait('@api', { timeout: 20000 })
			.then(({ request, response }) => {
				const url = new URL(request.url);
				const pageParam = url.searchParams.get('page');

				currentPage += 1;
				expect(pageParam).to.eq(String(currentPage));

				totalLoadedCount += (response!.body.items || []).length;
				limit = response!.body.limit;
			})
			.then(() => {
				for (let i = 0; i < limit; i++) {
					scrollAndAccumulate();
				}
			})
			.then(() => {
				cy.get('[data-testid="user-card"]', { timeout: 30000 }).should('have.length', totalLoadedCount);
			});
	});
});
