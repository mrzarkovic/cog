import { State } from "../types";
import { validateExpression } from "./validateExpression";

// Simple hash function for cache keys
function hashExpression(expression: string): string {
    let hash = 0;
    for (let i = 0; i < expression.length; i++) {
        const char = expression.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return `expr_${Math.abs(hash).toString(36)}`;
}

const functionCache: Record<string, (state: State) => unknown> = {};

export const createExpressionScope = (expression: string, state: State) => {
    // Validate expression for security before compiling
    validateExpression(expression);

    // Use cache key based on expression AND state keys to handle different state shapes
    const stateKeysHash = hashExpression(Object.keys(state).sort().join(","));
    const cacheKey = `${hashExpression(expression)}_${stateKeysHash}`;

    if (!functionCache[cacheKey]) {
        const functionBody = `return (state) => {${Object.keys(state)
            .map(
                (variable) => `const ${variable} = state["${variable}"].value;`,
            )
            .join("\n")} return ${expression}}`;

        functionCache[cacheKey] = Function(functionBody)();
    }

    return functionCache[cacheKey];
};
