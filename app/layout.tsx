// app/layout.tsx
import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import '@/globals.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import SpinnerOverlay from '@/store/Spinner/SpinnerOverlay';
import WarningOverlay from '@/store/Warning/WarningOverlay';

const notoSansKR = Noto_Sans_KR({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
	variable: '--font-noto-sans', // Noto 폰트 패밀리를 CSS 변수로 노출
	display: 'swap'
});

export const metadata: Metadata = {
	title: 'Aladin-assignment',
	description: 'Aladin-assignment'
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko" className={notoSansKR.variable}>
			{/* font-system 클래스에서 애플 기본 → Noto 순으로 폰트 설정 */}
			<body className="antialiased font-system">
				<ThemeProvider>
					{children}
					<WarningOverlay />
					<SpinnerOverlay />
				</ThemeProvider>
			</body>
		</html>
	);
}
