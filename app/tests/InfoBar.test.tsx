import { render, screen, fireEvent } from '@testing-library/react';
import InfoBar from '@/views/InfoBar';

describe('InfoBar', () => {
	it('totalCount, limit, remaining 값이 올바르게 표시된다', () => {
		render(<InfoBar perPage={10} setPerPage={jest.fn()} sortKey=" " setSortKey={jest.fn()} totalCount={12345} limit={1000} remaining={800} />);

		expect(screen.getByText('데이터 건수: 12,345')).toBeInTheDocument();
		expect(screen.getByText('쿼터(Total / Remain): 1,000 / 800')).toBeInTheDocument();
	});

	it('perPage 선택 변경 시 setPerPage가 호출된다', () => {
		const mockSetPerPage = jest.fn();

		render(<InfoBar perPage={10} setPerPage={mockSetPerPage} sortKey=" " setSortKey={jest.fn()} totalCount={0} limit={0} remaining={0} />);

		const select = screen.getByLabelText('개수');

		fireEvent.mouseDown(select);

		const option20 = screen.getByRole('option', { name: '20' });
		fireEvent.click(option20);

		expect(mockSetPerPage).toHaveBeenCalledWith(20);
	});

	it('정렬 조건 변경 시 setSortKey가 호출된다', () => {
		const mockSetSortKey = jest.fn();

		render(<InfoBar perPage={10} setPerPage={jest.fn()} sortKey=" " setSortKey={mockSetSortKey} totalCount={0} limit={0} remaining={0} />);

		const select = screen.getByLabelText('정렬');

		fireEvent.mouseDown(select);

		const followersOption = screen.getByRole('option', { name: 'followers' });
		fireEvent.click(followersOption);

		expect(mockSetSortKey).toHaveBeenCalledWith('followers');
	});
});
