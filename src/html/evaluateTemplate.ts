import { createExpressionScope } from "../expressions/createExpressionScope";
import { evaluateExpression } from "../expressions/evaluateExpression";
import { sanitizeExpression } from "../expressions/sanitizeExpression";
import { removeTagsAndAttributeNames } from "../html/removeTagsAndAttributeNames";
import { Expression, State, StateKey } from "../types";
import { findNextTemplateExpression } from "./findNextTemplateExpression";
import { htmlToText } from "./htmlToText";

export const evaluateTemplate = (
    template: string,
    expressions: Expression[],
    state: State,
    stateChanges: string[] = [],
): string => {
    let restOfContent = template;
    let updatedContent = "";

    for (let i = 0; i < expressions.length; i++) {
        const { start, end, value } = expressions[i];
        const before = restOfContent.slice(0, start);
        const after = restOfContent.slice(end + 1);

        let evaluated = expressions[i].evaluated;

        const intersection = expressions[i].dependencies.filter((value) =>
            stateChanges.includes(value),
        );

        if (intersection.length || evaluated === null) {
            try {
                const expressionWithScope = createExpressionScope(value, state);
                evaluated = evaluateExpression(expressionWithScope, state);
                expressions[i].evaluated = evaluated;
            } catch (error) {
                // Re-throw validation errors with context
                throw new Error(
                    `Failed to evaluate expression "${value}": ${(error as Error).message}`,
                );
            }
        }

        updatedContent += `${before}${evaluated}`;
        restOfContent = after;
    }

    updatedContent += restOfContent;

    return updatedContent;
};

/**
 * Extracts all template expressions from a template string.
 * start and end are relative to the last template expression.
 */
export const extractTemplateExpressions = (
    template: string,
    state: State,
): Expression[] => {
    const expressions = [];
    let restOfContent = String(template);
    let hasTemplateExpression = true;

    while (hasTemplateExpression) {
        const { start, end } = findNextTemplateExpression(restOfContent);

        if (end === -1) {
            hasTemplateExpression = false;
            break;
        }

        const htmlValue = restOfContent.slice(start + 2, end - 1);
        const after = restOfContent.slice(end + 1);
        const value = sanitizeExpression(htmlToText(htmlValue));
        const uniqueIndex: Record<string, boolean> = {};

        const dependencies = new Set<StateKey>();
        removeTagsAndAttributeNames(value)
            .split("@")
            .filter((wordFromExpression) =>
                uniqueIndex[wordFromExpression]
                    ? false
                    : (uniqueIndex[wordFromExpression] = true),
            )
            .filter((wordFromExpression) => state[wordFromExpression])
            .forEach((dependency) => {
                if (state[dependency].dependencies.length) {
                    state[dependency].dependencies.forEach((dep: StateKey) =>
                        dependencies.add(dep),
                    );
                } else {
                    dependencies.add(dependency);
                }
            });

        expressions.push({
            start,
            end,
            value,
            dependencies: Array.from(dependencies),
            evaluated: null,
        });

        restOfContent = after;
    }

    return expressions;
};
