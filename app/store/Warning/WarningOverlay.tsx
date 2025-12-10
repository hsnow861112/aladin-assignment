'use client';

import { useWarningStore } from '@/store/Warning/WarningStore';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

export default function WarningOverlay() {
	const { isOpen, message, closeWarning } = useWarningStore();

	return (
		<Dialog
			open={isOpen}
			onClose={closeWarning}
			PaperProps={{
				sx: {
					minWidth: 'min(300px, 90dvw)',
					minHeight: 'min(300px, 90dvh)',
					maxWidth: '90dvw',
					maxHeight: '90dvh',
					width: 'fit-content',
					height: 'fit-content'
				}
			}}
		>
			<DialogTitle>경고</DialogTitle>
			<DialogContent>
				<DialogContentText>{message}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={closeWarning}>닫기</Button>
			</DialogActions>
		</Dialog>
	);
}
