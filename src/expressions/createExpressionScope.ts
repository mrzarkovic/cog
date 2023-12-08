import { State } from "../types";

const functionCache: Record<string, (state: State) => unknown> = {};

export const createExpressionScope = (expression: string, state: State) => {
    try {
        const index = expression + JSON.stringify(Object.keys(state).join(""));
        if (!functionCache[index]) {
            const functionBody = `return (state) => {${Object.keys(state)
                .map((variable) => `const ${variable} = state["${variable}"];`)
                .join("\n")} return ${expression}}`;

            functionCache[index] = Function(functionBody)();
        }

        return functionCache[index];
    } catch (e: unknown) {
        throw new Error(
            `Failed to create function from expression {{${expression}}}: ${
                (e as Error).message
            }`
        );
    }
};
