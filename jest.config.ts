import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',

	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/app/$1',
		'\\.(css|scss|sass)$': 'identity-obj-proxy'
	},

	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

	testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],

	transform: {
		'^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }]
	}
};

export default config;
