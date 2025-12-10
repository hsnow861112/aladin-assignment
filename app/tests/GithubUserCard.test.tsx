import { render, screen, waitFor } from '@testing-library/react';
import UserListInfo from '@/views/UserListInfo';
import GithubUserCard from '@/components/GithubUserCard';
import { mockUser } from '@/tests/data';

// squoosh_resize.js
global.fetch = jest.fn(() =>
	Promise.resolve({
		blob: () => Promise.resolve(new Blob())
	})
) as unknown as typeof fetch;

global.URL.createObjectURL = jest.fn(() => 'blob:mock');

jest.mock('@/utils/resize/squoosh_resize', () => ({
	__esModule: true,
	default: jest.fn(() => Promise.resolve()),
	resize: jest.fn(() => new Uint8ClampedArray(120 * 120 * 4))
}));
// squoosh_resize.js

describe('GithubUserCard', () => {
	const mockGetContext = jest.fn(() => ({
		drawImage: jest.fn(),
		clearRect: jest.fn(),
		save: jest.fn(),
		restore: jest.fn(),
		putImageData: jest.fn(),
		beginPath: jest.fn(),
		arc: jest.fn(),
		clip: jest.fn(),
		getImageData: jest.fn(() => ({
			data: new Uint8ClampedArray(4),
			width: 1,
			height: 1
		}))
	}));

	beforeAll(() => {
		// @ts-expect-error mockGetContext
		jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(mockGetContext);

		global.ImageData = jest.fn();

		Object.defineProperty(global.Image.prototype, 'src', {
			set() {
				setTimeout(() => {
					if (this.onload) this.onload();
				}, 0);
			}
		});
	});

	test('GithubUserCard 컴포넌트에서 Props로 받은 Component가 화면 상에 렌더링 된다.', () => {
		render(<GithubUserCard user={mockUser} Component={UserListInfo} />);

		expect(screen.getByText('66654167')).toBeInTheDocument();
		expect(screen.getByText('Login hsnow861112')).toBeInTheDocument();
		expect(screen.getByText('Type: User')).toBeInTheDocument();
		expect(screen.getByText('Score: 1')).toBeInTheDocument();
	});

	test('Canvas 요소가 있고 해당 요소에 avatar 이미지가 그려진다.', async () => {
		render(<GithubUserCard user={mockUser} Component={UserListInfo} />);

		expect(document.querySelector('canvas')).toBeInTheDocument();

		await waitFor(() => {
			expect(mockGetContext.mock.results[0].value.drawImage).toHaveBeenCalled();
		});
	});
});
