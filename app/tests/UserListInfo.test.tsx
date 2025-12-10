import { render, screen } from '@testing-library/react';
import UserListInfo from '@/views/UserListInfo';
import { mockUser } from '@/tests/data';

describe('UserListInfo', () => {
	test('사용자 ID가 화면에 표시된다', () => {
		render(<UserListInfo user={mockUser} />);
		expect(screen.getByText('66654167')).toBeInTheDocument();
	});

	test('사용자 Login 정보가 표시된다', () => {
		render(<UserListInfo user={mockUser} />);
		expect(screen.getByText('Login hsnow861112')).toBeInTheDocument();
	});

	test('사용자 Type 정보가 표시된다', () => {
		render(<UserListInfo user={mockUser} />);
		expect(screen.getByText('Type: User')).toBeInTheDocument();
	});

	test('사용자 Score 정보가 표시된다', () => {
		render(<UserListInfo user={mockUser} />);
		expect(screen.getByText('Score: 1')).toBeInTheDocument();
	});
});
