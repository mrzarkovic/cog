import { Expression, State } from "../types";
import { evaluateExpression } from "../expressions/evaluateExpression";
import { findNextTemplateExpression } from "./findNextTemplateExpression";
import { htmlToText } from "./htmlToText";
import { sanitizeExpression } from "../expressions/sanitizeExpression";
import { createExpressionScope } from "../expressions/createExpressionScope";

export const evaluateTemplate = (
    template: string,
    expressions: Expression[],
    state: State
): string => {
    let restOfContent = template;
    let updatedContent = "";

    for (let i = 0; i < expressions.length; i++) {
        const { start, end, value } = expressions[i];
        const before = restOfContent.slice(0, start);
        const after = restOfContent.slice(end + 1);
        const expressionWithScope = createExpressionScope(value, state);
        const evaluated = evaluateExpression(expressionWithScope, state);
        updatedContent += `${before}${evaluated}`;
        restOfContent = after;
    }

    updatedContent += restOfContent;

    return updatedContent;
};

export const extractTemplateExpressions = (template: string): Expression[] => {
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

        expressions.push({
            start,
            end,
            value,
        });

        restOfContent = after;
    }

    return expressions;
};
