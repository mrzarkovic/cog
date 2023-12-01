import type { Config } from "jest";

const config: Config = {
    verbose: true,
    testEnvironment: "jsdom",
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.ts"],
    coverageThreshold: {
        global: {
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    coverageReporters: ["json-summary", "lcov"],
};

export default config;
