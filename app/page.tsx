'use client';

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, Switch, Typography } from '@mui/material';
import { Moon, SearchX, SquareArrowLeft, Sun } from 'lucide-react';
import Image from 'next/image';
import useTheme, { getInitialMode } from '@/providers/ThemeProvider';
import { GithubSearchUser } from '@/types';
import UserListInfo from '@/views/UserListInfo';
import UserDetailInfo from '@/views/UserDetailInfo';
import GithubUserCard from '@/components/GithubUserCard';
import CountdownSpinner from '@/views/CountdownSpinner';
import SearchInput from '@/views/SearchInput';
import InfoBar from './views/InfoBar';
import { useSpinnerStore } from './store/Spinner/SpinnerStore';
import { useWarningStore } from './store/Warning/WarningStore';

export default function Page(): ReactNode {
	const { mode, updateTheme, toggleTheme } = useTheme();

	const { openWarning } = useWarningStore();

	const scrollingRef = useRef<HTMLDivElement>(null);

	const { openSpinner, closeSpinner } = useSpinnerStore();

	// const [incompleteResults, setIncompleteResults] = useState<boolean>(false);
	const [userList, setUserList] = useState<GithubSearchUser[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [limit, setLimit] = useState<number>(0);
	const [remaining, setRemaining] = useState<number>(0);

	const [page, setPage] = useState<number>(0);
	const [perPage, setPerPage] = useState<number>(10);

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [isRetryData, setIsRetryData] = useState<boolean>(false);
	const [isRetrySecond, setIsRetrySecond] = useState<number>(0);

	const [hasNext, setHasNext] = useState<boolean>(false);

	const [detailUserInfo, setDetailUserInfo] = useState<GithubSearchUser | null>(null);

	const [sortKey, setSortKey] = useState<string>(` `);

	const searchQ = useRef<string>(``);

	const contentRef = useRef<HTMLDivElement | null>(null);
	const contentScrollTop = useRef<number>(0);

	useEffect(() => {
		updateTheme(getInitialMode());

		const mql = window.matchMedia?.('(prefers-color-scheme: dark)');

		if (!mql) return;

		const handleChange = (event: MediaQueryListEvent) => {
			updateTheme(event.matches ? 'dark' : 'light');
		};

		if (typeof mql.addEventListener === 'function') {
			mql.addEventListener('change', handleChange);
			return () => mql.removeEventListener('change', handleChange);
		} else if (typeof mql.addListener === 'function') {
			// 구형 브라우저 대응
			mql.addListener(handleChange);
			return () => mql.removeListener(handleChange);
		}
	}, []);

	useEffect(() => {
		if (!scrollingRef.current) return;

		const observer = new IntersectionObserver(entries => {
			if (isLoading) return;

			if (!hasNext) return;

			if (!entries[0].isIntersecting) return;

			if (isRetryData) return;

			setPage(prev => prev + 1);
		});

		observer.observe(scrollingRef.current);

		return () => {
			observer.disconnect();
		};
	}, [isLoading, hasNext, detailUserInfo, isRetryData]);

	const initData = async () => {
		setIsLoading(true);

		let url: string = `/api/search-users?page=${page}&perPage=${perPage}&q=${encodeURIComponent(searchQ.current)}`;

		if (0 < sortKey.trim().length) url += `&sort=${sortKey}&order=desc`;

		const res = await fetch(url);

		const data = (await res.json()) as {
			incomplete_results: boolean;
			items: GithubSearchUser[];
			total_count: number;
			limit: number;
			remaining: number;

			error?: string;
			wait?: number;
		};

		if (data.error) {
			setIsLoading(false);

			if (`rate_limit` === data.error) {
				setIsRetryData(true);
				setIsRetrySecond(data.wait as number);
			} else {
				openWarning(data.error);
			}

			return;
		}

		setIsRetryData(false);
		setIsRetrySecond(0);

		// setIncompleteResults(data.incomplete_results);
		setTotalCount(data.total_count);
		setLimit(data.limit);
		setRemaining(data.remaining);

		const newUserList: GithubSearchUser[] = [...userList, ...data.items];
		setUserList(newUserList);

		setHasNext(data.total_count > newUserList.length);

		setIsLoading(false);
	};

	const searchFunc = useCallback((paramSearchQ: string): void => {
		// setIncompleteResults(false);
		setUserList([]);
		setTotalCount(0);
		// setLimit(0);
		// setRemaining(0);

		setPage(0);
		// setPerPage(30);

		setTimeout(() => {
			setPage(1);
		}, 0);

		setIsLoading(false);
		setHasNext(false);

		setIsRetryData(false);
		setIsRetrySecond(0);

		setDetailUserInfo(null);

		contentScrollTop.current = 0;

		searchQ.current = paramSearchQ;
	}, []);

	useEffect(() => {
		if (0 === page) return;

		Promise.resolve().then(async () => {
			await initData();
		});
	}, [page]);

	const onClick = useCallback((user: GithubSearchUser): void => {
		setDetailUserInfo(user);
	}, []);

	const onScroll = useCallback(() => {
		if (!contentRef.current) return;

		contentScrollTop.current = contentRef.current.scrollTop;
	}, []);

	useEffect(() => {
		if (detailUserInfo) return;

		if (!contentScrollTop.current) return;

		if (!contentRef.current) return;

		contentRef.current.scrollTop = contentScrollTop.current;
	}, [detailUserInfo]);

	useEffect(() => {
		if (0 === Object.keys(searchQ.current).length) return;

		searchFunc(searchQ.current);
	}, [sortKey, perPage]);

	useEffect(() => {
		if (isLoading) openSpinner();
		else closeSpinner();
	}, [isLoading]);

	return (
		<div className="w-dvw h-dvh px-[10%] py-[30px] grid grid-rows-[100px_40px_1fr] max-md:grid-rows-[150px_150px_1fr]">
			<div className="flex flex-row items-center justify-center px-10 gap-x-5 max-md:flex-col max-md:gap-y-2">
				<Image
					src="/icons/logo.svg"
					alt="aladin"
					priority
					width={200}
					height={48}
					className="mb-2 cursor-pointer"
					onClick={() => {
						location.reload();
					}}
				/>
				<SearchInput searchFunc={searchFunc} />
				<div className="flex flex-row items-center max-md:fixed max-md:top-3 max-md:right-5">
					<Sun className={`dark` === mode ? `text-gray-400` : `text-[#90caf9]`} />
					<Switch checked={`dark` === mode} onChange={toggleTheme} />
					<Moon className={`dark` === mode ? `text-[#90caf9]` : `text-gray-400`} />
				</div>
			</div>
			<InfoBar
				perPage={perPage}
				setPerPage={setPerPage}
				sortKey={sortKey}
				setSortKey={setSortKey}
				totalCount={totalCount}
				limit={limit}
				remaining={remaining}
			/>
			{detailUserInfo ? (
				<div className="w-full h-full px-10 pt-1 flex flex-col gap-y-2 items-center justify-center overflow-hidden">
					<GithubUserCard user={detailUserInfo} Component={UserDetailInfo} />
					<Button
						variant="contained"
						color="info"
						onClick={() => {
							setDetailUserInfo(null);
						}}
					>
						<SquareArrowLeft size={15} className="mr-1" /> 뒤로 가기
					</Button>
				</div>
			) : (
				<>
					{0 < userList.length ? (
						<>
							<div className="overflow-y-auto px-10 py-1" data-testid="scroll-container" ref={contentRef} onScroll={onScroll}>
								<div
									data-testid="user-grid"
									className="
										grid
										grid-cols-1
										md:grid-cols-2
										lg:grid-cols-3
										xl:grid-cols-4
										gap-5
									"
								>
									{userList.map((user: GithubSearchUser): ReactNode => {
										return (
											<div key={user.id} data-testid="user-card" onClick={() => onClick(user)}>
												<GithubUserCard user={user} Component={UserListInfo} />
											</div>
										);
									})}
								</div>
								<div ref={scrollingRef} className="h-[1px]" />
							</div>
						</>
					) : (
						<div className="w-full py-6 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
							<SearchX size={200} />
							<Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
								조회된 결과가 없습니다.
							</Typography>
						</div>
					)}
				</>
			)}
			{isRetryData && (
				<CountdownSpinner
					seconds={isRetrySecond}
					callbackFunc={async () => {
						await initData();
					}}
				/>
			)}
		</div>
	);
}
