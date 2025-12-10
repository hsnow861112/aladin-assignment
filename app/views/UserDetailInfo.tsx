'use client';

import { GithubSearchUser, GithubUserDetail } from '@/types';
import { ReactNode, useEffect, useState } from 'react';
import { CardContent, Typography } from '@mui/material';
import UserListInfo from '@/views/UserListInfo';
import { useSpinnerStore } from '@/store/Spinner/SpinnerStore';
import { useWarningStore } from '@/store/Warning/WarningStore';

export default function UserDetailInfo({ user }: { user: GithubSearchUser }): ReactNode {
	const { openSpinner, closeSpinner } = useSpinnerStore();
	const { openWarning } = useWarningStore();

	const [userDetail, setUserDetail] = useState<GithubUserDetail | null>(null);

	useEffect(() => {
		Promise.resolve().then(async () => {
			openSpinner();

			const res = await fetch(`/api/detail-user?login=${encodeURIComponent(user.login)}`);

			const data = await res.json();

			if (data.error) openWarning(data.error);
			else setUserDetail(data);

			closeSpinner();
		});
	}, [user]);

	return (
		<>
			{userDetail ? (
				<CardContent
					sx={{
						width: '100%',
						overflowY: 'auto'
					}}
				>
					<Typography
						variant="h4"
						sx={{
							fontWeight: 600,
							textAlign: 'center',
							width: '100%',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis'
						}}
						title={userDetail.login}
					>
						{userDetail.login}
					</Typography>
					<Typography
						variant="h5"
						sx={{
							fontWeight: 600,
							textAlign: 'center',
							width: '100%',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							color: 'text.secondary'
						}}
						title={String(userDetail.id)}
					>
						id: {userDetail.id}
					</Typography>
					<Typography
						variant="h5"
						sx={{
							fontWeight: 600,
							textAlign: 'center',
							width: '100%',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							color: 'text.secondary'
						}}
						title={String(userDetail.name)}
					>
						name: {userDetail.name}
					</Typography>
					<Typography
						variant="h5"
						sx={{
							fontWeight: 600,
							textAlign: 'center',
							width: '100%',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							color: 'text.secondary'
						}}
						title={userDetail.user_view_type}
					>
						user_view_type: {userDetail.user_view_type}
					</Typography>
					<Typography
						variant="h5"
						sx={{
							fontWeight: 600,
							textAlign: 'center',
							width: '100%',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							color: 'text.secondary'
						}}
						title={String(userDetail.followers)}
					>
						followers: {userDetail.followers}
					</Typography>
					<Typography
						variant="h5"
						sx={{
							fontWeight: 600,
							textAlign: 'center',
							width: '100%',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							color: 'text.secondary'
						}}
						title={String(userDetail.following)}
					>
						following: {userDetail.following}
					</Typography>
					<Typography
						variant="h5"
						sx={{
							fontWeight: 600,
							textAlign: 'center',
							width: '100%',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							color: 'text.secondary'
						}}
						title={String(userDetail.public_repos)}
					>
						public_repos: {userDetail.public_repos}
					</Typography>
					<Typography
						variant="h5"
						sx={{
							fontWeight: 600,
							textAlign: 'center',
							width: '100%',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							color: 'text.secondary'
						}}
						title={String(userDetail.public_gists)}
					>
						public_gists: {userDetail.public_gists}
					</Typography>
					<Typography
						variant="h5"
						sx={{
							fontWeight: 600,
							textAlign: 'center',
							width: '100%',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							color: 'text.secondary'
						}}
						title={userDetail.created_at}
					>
						created_at: {userDetail.created_at}
					</Typography>
					<Typography
						variant="h5"
						sx={{
							fontWeight: 600,
							textAlign: 'center',
							width: '100%',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							color: 'text.secondary'
						}}
						title={userDetail.updated_at}
					>
						updated_at: {userDetail.updated_at}
					</Typography>
					<Typography
						variant="h5"
						sx={{
							fontWeight: 600,
							textAlign: 'center',
							width: '100%',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							color: 'text.secondary'
						}}
						title={userDetail.url}
					>
						url: {userDetail.url}
					</Typography>
				</CardContent>
			) : (
				<UserListInfo user={user} />
			)}
		</>
	);
}
