'use client';

import { GithubSearchUser } from '@/types';
import { ReactNode } from 'react';
import { CardContent, Typography } from '@mui/material';

export default function UserListInfo({ user }: { user: GithubSearchUser }): ReactNode {
	return (
		<div className="flex flex-col items-center w-full">
			<CardContent
				sx={{
					width: '100%'
				}}
			>
				<Typography
					variant="h4"
					title={user.login}
					sx={{
						fontWeight: 700,
						textAlign: 'center',
						width: '100%',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis'
					}}
				>
					{user.id}
				</Typography>

				<Typography
					variant="h5"
					title={String(user.id)}
					sx={{
						color: 'text.secondary',
						textAlign: 'center',
						width: '100%',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis'
					}}
				>
					Login {user.login}
				</Typography>

				<Typography
					variant="h5"
					title={user.type}
					sx={{
						color: 'text.secondary',
						textAlign: 'center',
						width: '100%',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis'
					}}
				>
					Type: {user.type}
				</Typography>

				<Typography
					variant="h5"
					title={String(user.score)}
					sx={{
						color: 'text.secondary',
						textAlign: 'center',
						width: '100%',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis'
					}}
				>
					Score: {user.score}
				</Typography>
			</CardContent>
		</div>
	);
}
