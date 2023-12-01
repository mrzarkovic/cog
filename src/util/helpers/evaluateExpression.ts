import { State } from "../../types";
import { createExpressionScope } from "./createExpressionScope";

export function evaluateExpression(expression: string, state: State): string {
    try {
        const expressionWithScope = createExpressionScope(expression, state);
        let evaluated = expressionWithScope(state);

        if (Array.isArray(evaluated)) {
            evaluated = evaluated.join("");
        }

        return evaluated;
    } catch (e: unknown) {
        throw new Error(
            `Failed to create function from expression {{${expression}}}: ${
                (e as Error).message
            }`
        );
    }
}
