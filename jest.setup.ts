import '@testing-library/jest-dom';

/* ------------ Next.js Mock -------------- */

// next/navigation
jest.mock('next/navigation', () => ({
	useRouter() {
		return {
			push: jest.fn(),
			replace: jest.fn(),
			back: jest.fn(),
			forward: jest.fn(),
			prefetch: jest.fn()
		};
	}
}));

// next/link
jest.mock('next/link', () => {
	return ({ children }: { children: React.ReactNode }) => children;
});

// next/image
jest.mock('next/image', () => () => 'NextImage');
