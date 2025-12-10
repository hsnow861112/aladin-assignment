import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from '@/views/SearchInput';

describe('SearchInput', () => {
	test('빈 검색어일 경우 isEmpty가 true로 설정되고 검색함수가 실행되지 않는다', () => {
		const mockSearch = jest.fn();
		render(<SearchInput searchFunc={mockSearch} />);

		const input = screen.getByPlaceholderText('계정 이름, 성명 또는 메일로 검색');

		fireEvent.keyUp(input, { key: 'Enter' });

		expect(screen.getByText('검색어가 없습니다.')).toBeInTheDocument();

		expect(mockSearch).not.toHaveBeenCalled();
	});

	test('검색어와 type 기반으로 올바른 쿼리 문자열을 생성한다', () => {
		const mockSearch = jest.fn();
		render(<SearchInput searchFunc={mockSearch} />);

		const input = screen.getByPlaceholderText('계정 이름, 성명 또는 메일로 검색');

		fireEvent.change(input, { target: { value: 'john' } });
		fireEvent.keyUp(input, { key: 'Enter' });

		expect(mockSearch).toHaveBeenCalledWith('john+type:user');
	});

	test('Type을 클릭하여 Organization을 선택하면 type:org 가 쿼리에 포함된다', () => {
		const mockSearch = jest.fn();
		render(<SearchInput searchFunc={mockSearch} />);

		const input = screen.getByPlaceholderText('계정 이름, 성명 또는 메일로 검색');
		fireEvent.change(input, { target: { value: 'john' } });

		const typeSelect = screen.getByLabelText('Type');
		fireEvent.mouseDown(typeSelect);

		fireEvent.click(screen.getByText('Organization'));

		fireEvent.keyUp(input, { key: 'Enter' });

		expect(mockSearch).toHaveBeenCalledWith('john+type:org');
	});
	test('Repo min/max 설정 시 repos 범위 쿼리가 포함된다', () => {
		const mockSearch = jest.fn();
		render(<SearchInput searchFunc={mockSearch} />);

		const input = screen.getByPlaceholderText('계정 이름, 성명 또는 메일로 검색');
		fireEvent.change(input, { target: { value: 'john' } });

		const repoMin = screen.getByLabelText('Repo Min');
		const repoMax = screen.getByLabelText('Repo Max');

		fireEvent.change(repoMin, { target: { value: 10 } });
		fireEvent.change(repoMax, { target: { value: 20 } });

		fireEvent.keyUp(input, { key: 'Enter' });

		expect(mockSearch).toHaveBeenCalledWith('john+type:user+repos:10..20');
	});

	test('Location 입력 시 location:값 이 쿼리에 포함된다', () => {
		const mockSearch = jest.fn();
		render(<SearchInput searchFunc={mockSearch} />);

		const input = screen.getByPlaceholderText('계정 이름, 성명 또는 메일로 검색');
		fireEvent.change(input, { target: { value: 'john' } });

		const locationInput = screen.getByLabelText('Location');
		fireEvent.change(locationInput, { target: { value: 'Seoul' } });

		fireEvent.keyUp(input, { key: 'Enter' });

		expect(mockSearch).toHaveBeenCalledWith('john+type:user+location:Seoul');
	});

	test('Language를 클릭으로 선택하면 language:type 이 쿼리에 포함된다', () => {
		const mockSearch = jest.fn();
		render(<SearchInput searchFunc={mockSearch} />);

		const input = screen.getByPlaceholderText('계정 이름, 성명 또는 메일로 검색');
		fireEvent.change(input, { target: { value: 'john' } });

		const langSelect = screen.getByLabelText('Language');
		fireEvent.mouseDown(langSelect);

		fireEvent.click(screen.getByText('TypeScript'));

		fireEvent.keyUp(input, { key: 'Enter' });

		expect(mockSearch).toHaveBeenCalledWith('john+type:user+language:typescript');
	});

	test('createdFrom과 createdTo 모두 입력 시 created:from..to 쿼리가 들어간다', () => {
		const mockSearch = jest.fn();
		render(<SearchInput searchFunc={mockSearch} />);

		const input = screen.getByPlaceholderText('계정 이름, 성명 또는 메일로 검색');
		fireEvent.change(input, { target: { value: 'john' } });

		fireEvent.change(screen.getByLabelText('Created From'), { target: { value: '2020-01-01' } });
		fireEvent.change(screen.getByLabelText('Created To'), { target: { value: '2021-01-01' } });

		fireEvent.keyUp(input, { key: 'Enter' });

		expect(mockSearch).toHaveBeenCalledWith('john+type:user+created:2020-01-01..2021-01-01');
	});

	test('Followers 범위 min/max 입력 시 followers:min..max 포함', () => {
		const mockSearch = jest.fn();
		render(<SearchInput searchFunc={mockSearch} />);

		const input = screen.getByPlaceholderText('계정 이름, 성명 또는 메일로 검색');
		fireEvent.change(input, { target: { value: 'john' } });

		fireEvent.change(screen.getByLabelText('Followers Min'), { target: { value: 10 } });
		fireEvent.change(screen.getByLabelText('Followers Max'), { target: { value: 30 } });

		fireEvent.keyUp(input, { key: 'Enter' });

		expect(mockSearch).toHaveBeenCalledWith('john+type:user+followers:10..30');
	});

	test('스폰서 가능 여부 체크 시 sponsorable:true 포함된다', () => {
		const mockSearch = jest.fn();
		render(<SearchInput searchFunc={mockSearch} />);

		const input = screen.getByPlaceholderText('계정 이름, 성명 또는 메일로 검색');
		fireEvent.change(input, { target: { value: 'john' } });

		const sponsorCheckbox = screen.getByLabelText('Only sponsorable');
		fireEvent.click(sponsorCheckbox);

		fireEvent.keyUp(input, { key: 'Enter' });

		expect(mockSearch).toHaveBeenCalledWith('john+type:user+sponsorable:true');
	});

	test('상세 검색 토글 클릭 시 상세 영역이 열리고 닫힌다', () => {
		const mockSearch = jest.fn();
		const { container } = render(<SearchInput searchFunc={mockSearch} />);

		const detailContainer = container.querySelector('.flex.flex-col.gap-y-\\[15px\\]');

		expect(detailContainer).toBeTruthy(); // 존재는 한다

		expect(detailContainer).toHaveStyle({ height: '0px' });
		expect(detailContainer).toHaveStyle({ opacity: '0' });

		const input = screen.getByPlaceholderText('계정 이름, 성명 또는 메일로 검색');
		const inputRoot = input.closest('.MuiOutlinedInput-root')!;
		const adornment = inputRoot.querySelector('.MuiInputAdornment-root')!;
		const iconButtons = adornment.querySelectorAll('button');

		const toggleButton = iconButtons[iconButtons.length - 1];

		fireEvent.click(toggleButton);

		expect(detailContainer).not.toHaveStyle({ height: '0px' });
		expect(detailContainer).toHaveStyle({ opacity: '1' });

		fireEvent.click(toggleButton);

		expect(detailContainer).toHaveStyle({ height: '0px' });
		expect(detailContainer).toHaveStyle({ opacity: '0' });
	});
});
