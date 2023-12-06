import { State } from "../types";
import { evaluateExpression } from "../expressions/evaluateExpression";
import { findNextTemplateExpression } from "./findNextTemplateExpression";
import { htmlToText } from "./htmlToText";

export const evaluateTemplate = (template: string, state: State): string => {
    let restOfContent = template;
    let hasTemplateExpression = true;
    let updatedContent = "";

    while (hasTemplateExpression) {
        const { start, end } = findNextTemplateExpression(restOfContent);

        if (end === -1) {
            hasTemplateExpression = false;
            break;
        }

        const htmlValue = restOfContent.slice(start + 2, end - 1);
        const before = restOfContent.slice(0, start);
        const after = restOfContent.slice(end + 1);
        const value = htmlToText(htmlValue);

        const evaluated = evaluateExpression(value, state);
        updatedContent += `${before}${evaluated}`;

        restOfContent = after;
    }

    updatedContent += restOfContent;

    return updatedContent;
};
