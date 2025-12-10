'use client';

import { useSpinnerStore } from '@/store/Spinner/SpinnerStore';
import { createPortal } from 'react-dom';
import CircularProgress from '@mui/material/CircularProgress';

export default function SpinnerOverlay() {
	const { isOpen } = useSpinnerStore();

	return (
		isOpen &&
		createPortal(
			<div className="fixed inset-0 flex items-center justify-center bg-black opacity-80 z-[9999] pointer-events-auto">
				<CircularProgress size={100} />
			</div>,
			document.body
		)
	);
}
