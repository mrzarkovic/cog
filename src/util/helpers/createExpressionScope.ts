import { State } from "../../types";

export const createExpressionScope = (expression: string, state: State) => {
    const functionBody = `return (state) => {${Object.keys(state)
        .map((variable) => `const ${variable} = state["${variable}"];`)
        .join("\n")} return ${expression}}`;

    return Function(functionBody)();
};
