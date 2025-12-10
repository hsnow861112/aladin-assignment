import { render, screen } from '@testing-library/react';
import UserDetailInfo from '@/views/UserDetailInfo';
import React from 'react';
import { mockDetailUser, mockUser } from '@/tests/data';

global.fetch = jest.fn(() =>
	Promise.resolve({
		json: () => Promise.resolve(mockDetailUser)
	})
) as jest.Mock;

jest.mock('@/store/Spinner/SpinnerStore', () => ({
	useSpinnerStore: () => ({
		openSpinner: jest.fn(),
		closeSpinner: jest.fn()
	})
}));

jest.mock('@/store/Warning/WarningStore', () => ({
	useWarningStore: () => ({
		openWarning: jest.fn()
	})
}));

describe('UserDetailInfo', () => {
	test('userDetail이 존재할 때 상세 데이터가 렌더링되는가?', () => {
		jest.spyOn(React, 'useState').mockReturnValue([mockDetailUser, jest.fn()]);

		render(<UserDetailInfo user={mockUser} />);

		expect(screen.getByText('hsnow861112')).toBeInTheDocument();
		expect(screen.getByText('id: 66654167')).toBeInTheDocument();
		expect(screen.getByText('name: hsnow861112')).toBeInTheDocument();
		expect(screen.getByText('user_view_type: public')).toBeInTheDocument();
		expect(screen.getByText('followers: 0')).toBeInTheDocument();
		expect(screen.getByText('following: 0')).toBeInTheDocument();
		expect(screen.getByText('public_repos: 1')).toBeInTheDocument();
		expect(screen.getByText('public_gists: 0')).toBeInTheDocument();
		expect(screen.getByText('created_at: 2020-06-09T01:32:37Z')).toBeInTheDocument();
		expect(screen.getByText('updated_at: 2024-02-25T23:15:31Z')).toBeInTheDocument();
		expect(screen.getByText('url: https://api.github.com/users/hsnow861112')).toBeInTheDocument();
	});

	test('userDetail이 존재하지 때 기본 데이터가 렌더링되는가?', () => {
		jest.spyOn(React, 'useState').mockReturnValue([null, jest.fn()]);

		render(<UserDetailInfo user={mockUser} />);

		expect(screen.getByText('66654167')).toBeInTheDocument();
		expect(screen.getByText('Login hsnow861112')).toBeInTheDocument();
		expect(screen.getByText('Type: User')).toBeInTheDocument();
		expect(screen.getByText('Score: 1')).toBeInTheDocument();
	});
});
