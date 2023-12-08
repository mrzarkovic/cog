import { State } from "../types";

export function evaluateExpression(
    expressionWithScope: (state: State) => unknown,
    state: State
): string {
    let evaluated = expressionWithScope(state);

    if (Array.isArray(evaluated)) {
        evaluated = evaluated.join("");
    }

    return evaluated as string;
}
