/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
	preset: "ts-jest",
	testEnvironment: "node",
	transform: {
		"^.+\\.ts?$": "ts-jest",
	},
	testMatch: ["**/tests/**/*.(test|spec).(ts|tsx)"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	moduleDirectories: ["node_modules", "src"],
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageProvider: "v8",
};
