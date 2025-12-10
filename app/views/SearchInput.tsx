'use client';

import { useCallback, useRef, useState } from 'react';
import { Button, Checkbox, FormControlLabel, FormHelperText, IconButton, InputAdornment, MenuItem, TextField, useTheme } from '@mui/material';
import { ArrowDown, ArrowUp, RotateCw, Search, SquareXIcon, X } from 'lucide-react';

export default function SearchInput({ searchFunc }: { searchFunc: (paramSearchQ: string) => void }) {
	const theme = useTheme();

	const searchRoot = useRef<HTMLDivElement>(null);

	const [isOpenExpandSearch, setIsOpenExpandSearch] = useState<boolean>(false);

	const [value, setValue] = useState<string>(``);

	const [type, setType] = useState<string>(`user`);

	const [repoMin, setRepoMin] = useState<number>(0);
	const [repoMax, setRepoMax] = useState<number>(0);

	const [location, setLocation] = useState<string>(` `);

	const [lang, setLang] = useState<string>(` `);

	const [createdFrom, setCreatedFrom] = useState<string>(``);
	const [createdTo, setCreatedTo] = useState<string>(``);

	const [followersMin, setFollowersMin] = useState<number>(0);
	const [followersMax, setFollowersMax] = useState<number>(0);

	const [isSponsor, setIsSponsor] = useState<boolean>(false);

	const [isEmpty, setIsEmpty] = useState<boolean>(false);

	const executeSearch = useCallback((): void => {
		const queries: string[] = [];

		if (0 === value.trim().length) {
			setIsEmpty(true);
			return;
		}

		setIsEmpty(false);

		queries.push(value.trim());

		queries.push(`type:${type}`);

		if (repoMin > 0 || repoMax > 0) {
			if (repoMin > 0 && repoMax > 0) queries.push(`repos:${repoMin}..${repoMax}`);
			else if (repoMin > 0) queries.push(`repos:>=${repoMin}`);
			else if (repoMax > 0) queries.push(`repos:<=${repoMax}`);
		}

		if (0 < location.trim().length) {
			queries.push(`location:${location.trim()}`);
		}

		if (0 < lang.trim().length) {
			queries.push(`language:${lang.trim()}`);
		}

		if (createdFrom && createdTo) queries.push(`created:${createdFrom}..${createdTo}`);
		else if (createdFrom) queries.push(`created:>=${createdFrom}`);
		else if (createdTo) queries.push(`created:<=${createdTo}`);

		if (followersMin > 0 || followersMax > 0) {
			if (followersMin > 0 && followersMax > 0) queries.push(`followers:${followersMin}..${followersMax}`);
			else if (followersMin > 0) queries.push(`followers:>=${followersMin}`);
			else if (followersMax > 0) queries.push(`followers:<=${followersMax}`);
		}

		if (isSponsor) queries.push(`sponsorable:true`);

		const q = queries.join('+');

		setIsOpenExpandSearch(false);
		searchFunc(q);
	}, [searchFunc, value, type, repoMin, repoMax, location, lang, createdFrom, createdTo, followersMin, followersMax, isSponsor]);

	return (
		<div className="relative w-full" ref={searchRoot}>
			{isEmpty && (
				<FormHelperText
					error
					sx={{
						position: 'absolute',
						top: '45px',
						left: '20px',
						m: 0,
						color: '#d32f2f',
						fontSize: '0.75rem',
						zIndex: 9999
					}}
				>
					검색어가 없습니다.
				</FormHelperText>
			)}
			<TextField
				fullWidth
				placeholder="계정 이름, 성명 또는 메일로 검색"
				size="small"
				data-testid="search-input"
				autoFocus
				value={value}
				error={isEmpty}
				onKeyUp={(evt: React.KeyboardEvent<HTMLInputElement>) => {
					if ('Enter' === evt.key) {
						executeSearch();
					}
				}}
				onChange={e => setValue(e.target.value)}
				sx={{
					'& .MuiOutlinedInput-root': {
						borderRadius: 30,
						paddingRight: 1,
						paddingLeft: 1
					}
				}}
				InputProps={{
					endAdornment: (
						<InputAdornment
							position="end"
							sx={{
								paddingRight: '5px'
							}}
						>
							{value && (
								<IconButton
									onClick={() => setValue('')}
									size="small"
									sx={{
										width: 25,
										height: 25,
										border: '1px solid #ccc',
										borderRadius: '50%',
										lineHeight: 1
									}}
								>
									<X />
								</IconButton>
							)}
							<IconButton
								onClick={executeSearch}
								size="small"
								sx={{
									width: 25,
									height: 25,
									border: '1px solid #ccc',
									borderRadius: '50%',
									lineHeight: 1,
									marginLeft: '5px'
								}}
							>
								<Search />
							</IconButton>
							<IconButton
								onClick={() => setIsOpenExpandSearch(prev => !prev)}
								size="small"
								sx={{
									width: 25,
									height: 25,
									border: '1px solid #ccc',
									borderRadius: '50%',
									lineHeight: 1,
									marginLeft: '5px'
								}}
							>
								<ArrowUp className={isOpenExpandSearch ? '' : 'hidden'} />
								<ArrowDown className={isOpenExpandSearch ? 'hidden' : ''} />
							</IconButton>
						</InputAdornment>
					)
				}}
			></TextField>
			<div
				className="
					flex flex-col gap-y-[15px]
					w-[calc(100%-20px)]
					absolute top-[50px] left-[10px]
					z-[999]
					rounded-sm
					overflow-y-auto
				"
				style={{
					height: isOpenExpandSearch ? 'auto' : 0,
					border: isOpenExpandSearch ? '1px solid #ccc' : '0px',
					opacity: isOpenExpandSearch ? 1 : 0,
					padding: isOpenExpandSearch ? 16 : 0,
					backgroundColor: theme.palette.background.paper
				}}
			>
				<div>
					<TextField
						id="asdf"
						select
						fullWidth
						label="Type"
						value={type}
						onChange={e => setType(e.target.value)}
						variant="outlined"
						size="small"
					>
						{[
							{ label: 'User', value: 'user' },
							{ label: 'Organization', value: 'org' }
						].map(t => (
							<MenuItem key={t.value} value={t.value}>
								{t.label}
							</MenuItem>
						))}
					</TextField>
				</div>
				<div className="flex flex-row gap-x-2 items-center">
					<TextField
						label="Repo Min"
						type="number"
						value={repoMin}
						onChange={e => setRepoMin(Number(e.target.value))}
						size="small"
						fullWidth
						error={repoMin > repoMax}
						helperText={repoMin > repoMax ? '최소값은 최대값보다 클 수 없습니다.' : ''}
					/>
					~
					<TextField
						label="Repo Max"
						type="number"
						value={repoMax}
						onChange={e => setRepoMax(Number(e.target.value))}
						size="small"
						fullWidth
						error={repoMin > repoMax}
						helperText={repoMin > repoMax ? ' ' : ''}
					/>
				</div>
				<div>
					<TextField label="Location" size="small" value={location} onChange={e => setLocation(e.target.value)} fullWidth />
				</div>
				<div>
					<TextField select label="Language" size="small" fullWidth value={lang} onChange={e => setLang(e.target.value)}>
						<MenuItem value=" ">전체</MenuItem>
						<MenuItem value="javascript">JavaScript</MenuItem>
						<MenuItem value="typescript">TypeScript</MenuItem>
						<MenuItem value="python">Python</MenuItem>
						<MenuItem value="java">Java</MenuItem>
					</TextField>
				</div>
				<div className="flex flex-row gap-x-2 items-center">
					<TextField
						label="Created From"
						type="date"
						size="small"
						value={createdFrom}
						onChange={e => setCreatedFrom(e.target.value)}
						fullWidth
						InputLabelProps={{ shrink: true }}
						error={new Date(createdFrom).getTime() > new Date(createdTo).getTime()}
						helperText={new Date(createdFrom).getTime() > new Date(createdTo).getTime() ? 'From은 To 이전이어야 합니다.' : ''}
					/>
					<IconButton
						onClick={() => setCreatedFrom('')}
						size="small"
						sx={{
							width: 25,
							height: 25,
							border: '1px solid #ccc',
							borderRadius: '50%',
							lineHeight: 1
						}}
					>
						<RotateCw />
					</IconButton>
					~
					<TextField
						label="Created To"
						type="date"
						size="small"
						value={createdTo}
						onChange={e => setCreatedTo(e.target.value)}
						fullWidth
						InputLabelProps={{ shrink: true }}
						error={new Date(createdFrom).getTime() > new Date(createdTo).getTime()}
						helperText={new Date(createdFrom).getTime() > new Date(createdTo).getTime() ? ` ` : ''}
					/>
					<IconButton
						onClick={() => setCreatedTo('')}
						size="small"
						sx={{
							width: 25,
							height: 25,
							border: '1px solid #ccc',
							borderRadius: '50%',
							lineHeight: 1
						}}
					>
						<RotateCw />
					</IconButton>
				</div>
				<div className="flex flex-row gap-x-2 items-center">
					<TextField
						label="Followers Min"
						type="number"
						value={followersMin}
						onChange={e => setFollowersMin(Number(e.target.value))}
						size="small"
						fullWidth
						error={followersMin > followersMax}
						helperText={followersMin > followersMax ? '최소값은 최대값보다 클 수 없습니다.' : ''}
					/>
					~
					<TextField
						label="Followers Max"
						type="number"
						value={followersMax}
						onChange={e => setFollowersMax(Number(e.target.value))}
						size="small"
						fullWidth
						error={followersMin > followersMax}
						helperText={followersMin > followersMax ? ' ' : ''}
					/>
				</div>
				<div className="flex flex-row gap-x-2 items-center">
					<FormControlLabel
						control={<Checkbox />}
						label="Only sponsorable"
						value={isSponsor}
						onChange={(event, checked) => setIsSponsor(checked)}
					/>
				</div>
				<div className="ml-auto flex flex-row gap-x-1">
					<Button variant="contained" color="primary" onClick={executeSearch}>
						<Search size={15} className="mr-1" /> 검색
					</Button>
					<Button variant="contained" color="secondary" onClick={() => setIsOpenExpandSearch(false)}>
						<SquareXIcon size={15} className="mr-1" /> 닫기
					</Button>
				</div>
			</div>
		</div>
	);
}
