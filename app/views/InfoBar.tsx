import { ReactNode } from 'react';
import { Box, MenuItem, TextField, Typography } from '@mui/material';

export default function InfoBar({
	perPage,
	setPerPage,
	sortKey,
	setSortKey,
	totalCount,
	limit,
	remaining
}: {
	perPage: number;
	setPerPage: (perPage: number) => void;
	sortKey: string;
	setSortKey: (sortKey: string) => void;
	totalCount: number;
	limit: number;
	remaining: number;
}): ReactNode {
	return (
		<div className="px-10 pb-5 flex flex-row gap-x-2 justify-end max-md:flex-col max-md:justify-start max-md:gap-y-3">
			<div className="mr-auto flex flex-row gap-x-2 max-md:flex-col max-md:gap-y-4 max-md:w-full">
				<TextField
					select
					label="개수"
					size="small"
					sx={theme => ({
						'& .MuiInputBase-root': {
							height: 32,
							[theme.breakpoints.up('md')]: {
								width: 100
							},
							[theme.breakpoints.down('md')]: {
								width: 'auto'
							}
						}
					})}
					fullWidth
					value={perPage}
					onChange={e => setPerPage(Number(e.target.value))}
				>
					<MenuItem value="10">10</MenuItem>
					<MenuItem value="20">20</MenuItem>
					<MenuItem value="30">30</MenuItem>
				</TextField>
				<TextField
					select
					label="정렬"
					size="small"
					sx={theme => ({
						'& .MuiInputBase-root': {
							height: 32,
							[theme.breakpoints.up('md')]: {
								width: 100
							},
							[theme.breakpoints.down('md')]: {
								width: 'auto'
							}
						}
					})}
					fullWidth
					value={sortKey}
					onChange={e => setSortKey(e.target.value)}
				>
					<MenuItem value=" ">기본</MenuItem>
					<MenuItem value="followers">followers</MenuItem>
					<MenuItem value="repositories">repositories</MenuItem>
					<MenuItem value="joined">joined</MenuItem>
				</TextField>
			</div>
			<Typography
				variant="h6"
				sx={{
					textAlign: 'right',
					fontWeight: 400,
					fontSize: {
						xs: '0.75rem',
						sm: '0.85rem',
						md: '0.95rem',
						lg: '1rem',
						xl: '1.1rem'
					}
				}}
			>
				데이터 건수: {totalCount.toLocaleString()}
			</Typography>
			<Typography
				variant="h6"
				sx={{
					textAlign: 'right',
					fontWeight: 400,
					fontSize: {
						xs: '0.75rem',
						sm: '0.85rem',
						md: '0.95rem',
						lg: '1rem',
						xl: '1.1rem'
					}
				}}
			>
				쿼터(Total / Remain): {limit.toLocaleString()} / {remaining.toLocaleString()}
			</Typography>
		</div>
	);
}
