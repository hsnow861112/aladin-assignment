import { NextResponse } from 'next/server';

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const login = searchParams.get('login');

	if (!login) {
		return NextResponse.json({ error: 'login parameter is required' }, { status: 400 });
	}

	const url: string = `https://api.github.com/users/${login}`;

	const res = await fetch(url, {
		headers: {
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28'
			// Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
		},
		cache: 'no-store'
	});

	if (!res.ok) {
		return NextResponse.json({ error: res.statusText }, { status: res.status });
	}

	const data = await res.json();

	return NextResponse.json(data);
}
