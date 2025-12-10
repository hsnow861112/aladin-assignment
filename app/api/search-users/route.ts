import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);

	let url: string = `https://api.github.com/search/users?q=${searchParams.get(`q`)}&page=${searchParams.get(`page`)}&per_page=${searchParams.get(`perPage`)}`;

	if (searchParams.get(`sort`)) {
		url += `&sort=${searchParams.get(`sort`)}`;

		if (searchParams.get(`order`)) {
			url += `&order=${searchParams.get(`order`)}`;
		} else {
			url += `&order=desc`;
		}
	}

	const res = await fetch(url, {
		headers: {
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28'
			// Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
		},
		cache: 'no-store'
	});

	const limit = res.headers.get('x-Ratelimit-limit');
	const remaining = res.headers.get('X-RateLimit-Remaining');
	const reset = res.headers.get('X-RateLimit-Reset');
	const retryAfter = res.headers.get('Retry-After');

	if (403 === res.status && '0' === remaining) {
		const waitSec = Number(reset) - Math.floor(Date.now() / 1000);

		return NextResponse.json({
			error: 'rate_limit',
			wait: 0 < waitSec ? waitSec + 1 : 1
		});
	}

	if (!res.ok) {
		return NextResponse.json({ error: res.statusText }, { status: res.status });
	}

	const data = await res.json();

	data.limit = limit;
	data.remaining = remaining;
	data.reset = reset;
	data.retryAfter = retryAfter;

	return NextResponse.json(data);
}
