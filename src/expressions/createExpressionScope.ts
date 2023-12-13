import { State } from "../types";

const functionCache: Record<string, (state: State) => unknown> = {};

export const createExpressionScope = (expression: string, state: State) => {
    const index = expression + JSON.stringify(Object.keys(state).join(""));
    if (!functionCache[index]) {
        const functionBody = `return (state) => {${Object.keys(state)
            .map(
                (variable) => `const ${variable} = state["${variable}"].value;`
            )
            .join("\n")} return ${expression}}`;

        functionCache[index] = Function(functionBody)();
    }

    return functionCache[index];
};
