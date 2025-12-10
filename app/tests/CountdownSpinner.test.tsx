import { render, screen, act } from '@testing-library/react';
import CountdownSpinner from '@/views/CountdownSpinner';

describe('CountdownSpinner', () => {
	const WorkerMock = jest.fn().mockImplementation(function (this: {
		onmessage: ((ev: MessageEvent) => void) | null;
		postMessage: jest.Mock;
		terminate: jest.Mock;
	}) {
		this.onmessage = jest.fn();
		this.postMessage = jest.fn();
		this.terminate = jest.fn();
	});

	beforeAll(() => {
		global.Worker = WorkerMock;
		global.URL.createObjectURL = jest.fn(() => 'mock');
	});

	beforeEach(() => {
		WorkerMock.mockClear();
	});

	it('초기 seconds 렌더링 확인', () => {
		render(<CountdownSpinner seconds={3} callbackFunc={jest.fn()} />);
		expect(screen.getByText('3초 후 다시 시도합니다...')).toBeInTheDocument();
	});

	it('3초 이후 callback 함수 실행 확인', () => {
		const callback = jest.fn();

		render(<CountdownSpinner seconds={3} callbackFunc={callback} />);

		act(() => {
			WorkerMock.mock.instances[0].onmessage!(
				new MessageEvent('message', {
					data: { remainSeconds: 0, done: true }
				})
			);
		});

		expect(callback).toHaveBeenCalledTimes(1);
	});
});
