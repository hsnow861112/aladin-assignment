'use client';

import { create } from 'zustand';

export interface SpinnerStore {
	isOpen: boolean;
	openSpinner: () => void;
	closeSpinner: () => void;
}

export const useSpinnerStore = create<SpinnerStore>(set => ({
	isOpen: false,
	openSpinner: () => set({ isOpen: true }),
	closeSpinner: () => set({ isOpen: false })
}));
