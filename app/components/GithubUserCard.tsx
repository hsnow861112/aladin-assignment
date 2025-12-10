'use client';

import { GithubSearchUser } from '@/types';
import { ReactNode, useEffect, useRef } from 'react';
import init, { resize } from '@/utils/resize/squoosh_resize';
import { Card } from '@mui/material';

export default function GithubUserCard({ user, Component }: { user: GithubSearchUser; Component: (info: { user: GithubSearchUser }) => ReactNode }) {
	const avatarRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		Promise.resolve().then(async () => {
			await init();

			const blob = await fetch(user.avatar_url).then(r => r.blob());

			const img = document.createElement('img');
			img.src = URL.createObjectURL(blob);

			await new Promise(resolve => {
				img.onload = resolve;
				img.onerror = resolve;
			});

			const tmpCanvas = document.createElement('canvas');
			tmpCanvas.width = img.width;
			tmpCanvas.height = img.height;

			const tmpCtx = tmpCanvas.getContext('2d')!;
			tmpCtx.drawImage(img, 0, 0);

			const input = tmpCtx.getImageData(0, 0, img.width, img.height);

			const buffer = resize(input.data as unknown as Uint8Array, input.width, input.height, 120, 120, 3, false, false);

			const circleCanvas = document.createElement('canvas');
			circleCanvas.width = 120;
			circleCanvas.height = 120;

			const circleCtx = circleCanvas.getContext('2d')!;
			const resizedImageData = new ImageData(new Uint8ClampedArray(buffer), 120, 120);

			circleCtx.putImageData(resizedImageData, 0, 0);

			const size = 120;

			if (!avatarRef.current) return;

			const ctx = avatarRef.current.getContext('2d')!;

			ctx.clearRect(0, 0, size, size);

			ctx.save();
			ctx.beginPath();
			ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
			ctx.clip();

			ctx.drawImage(circleCanvas, 0, 0, size, size);

			ctx.restore();
		});
	}, [user]);

	return (
		<Card
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				padding: 2,
				gap: 2,
				borderRadius: 2,
				cursor: 'pointer',
				transition: 'background-color 0.3s ease',
				'&:hover': {
					backgroundColor: theme => theme.palette.action.hover
				}
			}}
			className="w-full"
			elevation={3}
		>
			<div className="w-[30%] min-w-[150px] flex items-center justify-center">
				<canvas ref={avatarRef} width={120} height={120} style={{ width: `120px`, height: `120px` }} />
			</div>
			<Component user={user} />
		</Card>
	);
}
