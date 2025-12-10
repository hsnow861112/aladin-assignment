'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import CircularProgress from '@mui/material/CircularProgress';

export default function CountdownSpinner({ seconds, callbackFunc }: { seconds: number; callbackFunc: () => void }) {
	const [remainSeconds, setRemainSeconds] = useState<number>(seconds);

	useEffect(() => {
		const worker = new Worker(
			URL.createObjectURL(
				new Blob(
					[
						`(${function () {
							self.onmessage = (evt: MessageEvent): void => {
								let remainSeconds: number = evt.data.seconds;
								let done: boolean = false;

								const intervalId = setInterval((): void => {
									remainSeconds -= 1;
									done = 0 >= remainSeconds;

									if (done) clearInterval(intervalId);

									postMessage({ remainSeconds, done });
								}, 1000);
							};
						}.toString()})()`
					],
					{ type: 'application/javascript' }
				)
			)
		);

		worker.onmessage = (evt: MessageEvent): void => {
			const { remainSeconds, done } = evt.data;

			setRemainSeconds(remainSeconds);

			if (done) {
				worker.terminate();
				callbackFunc();
			}
		};

		worker.postMessage({ seconds });

		return () => {
			worker.terminate();
		};
	}, []);

	return createPortal(
		<div
			className="fixed inset-0 flex flex-col items-center justify-center bg-black/70 z-[9999] text-white pointer-events-auto"
			data-testid="spinner"
		>
			<CircularProgress size={100} />
			<div className="mt-4 text-xl font-semibold">{remainSeconds}초 후 다시 시도합니다...</div>
		</div>,
		document.body
	);
}
