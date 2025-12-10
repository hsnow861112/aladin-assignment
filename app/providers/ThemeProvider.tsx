'use client';

import { createTheme, ThemeProvider as ThemeProviderComp } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Theme = {
	mode: 'light' | 'dark';
	updateTheme: (mode: 'light' | 'dark') => void;
	toggleTheme: () => void;
};

const ThemeContext = createContext<Theme>({
	mode: 'light',
	updateTheme: () => {},
	toggleTheme: () => {}
});

export function getInitialMode(): 'light' | 'dark' {
	if ('undefined' === typeof window) return 'light';

	const mql = window.matchMedia?.('(prefers-color-scheme: dark)');
	return mql && mql.matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [mode, setMode] = useState<'light' | 'dark'>(`light`);

	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode
				}
			}),
		[mode]
	);

	const updateTheme = useCallback((nextMode: 'light' | 'dark') => {
		setMode(nextMode);
	}, []);

	const toggleTheme = useCallback(() => {
		setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
	}, []);

	return (
		<ThemeContext.Provider value={{ mode, updateTheme, toggleTheme }}>
			<GlobalStyles
				styles={{
					body: {
						backgroundColor: theme.palette.background.default,
						color: theme.palette.text.primary
					},
					'::-webkit-scrollbar': {
						width: 6
					},
					'::-webkit-scrollbar-thumb': {
						backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300],
						borderRadius: 9999
					},
					'::-webkit-scrollbar-track': {
						backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[200]
					}
				}}
			/>
			<ThemeProviderComp theme={theme}>{children}</ThemeProviderComp>
		</ThemeContext.Provider>
	);
}

export default function useTheme() {
	return useContext(ThemeContext);
}
