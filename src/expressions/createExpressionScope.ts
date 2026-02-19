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

// Two-level cache: expression -> state shape -> compiled function
const functionCache: Record<string, Record<string, Function>> = {};

export const createExpressionScope = (expression: string, _state: State) => {
    // Validate expression for security before compiling
    validateExpression(expression);

    // Cache key based on expression only
    const expressionKey = hashExpression(expression);

    // Initialize cache for this expression if it doesn't exist
    if (!functionCache[expressionKey]) {
        functionCache[expressionKey] = {};
    }

    // Return a function that compiles with the actual state shape at runtime
    return (actualState: State) => {
        // Create a state shape key based on the current state keys
        const stateKeys = Object.keys(actualState).sort();
        const stateShapeKey = stateKeys.join(",");

        // Check if we have a cached function for this expression + state shape combination
        if (!functionCache[expressionKey][stateShapeKey]) {
            // Create and cache a new function for this specific state shape
            const params = stateKeys;
            const functionBody = `return ${expression}`;

            functionCache[expressionKey][stateShapeKey] = Function(
                ...params,
                functionBody,
            );
        }

        // Extract state values in the same order as the parameters
        const args = stateKeys.map((key) => actualState[key].value);

        // Call the cached function with the extracted values
        return (functionCache[expressionKey][stateShapeKey] as Function)(
            ...args,
        );
    };
};
