'use client';

import { create } from 'zustand';

export interface WarningStore {
	isOpen: boolean;
	message: string;
	openWarning: (msg: string) => void;
	closeWarning: () => void;
}

export const useWarningStore = create<WarningStore>(set => ({
	isOpen: false,
	message: '',
	openWarning: msg => set({ isOpen: true, message: msg }),
	closeWarning: () => set({ isOpen: false, message: '' })
}));
