import { HTMLString } from "../types";

export function findNextTemplateExpression(htmlText: HTMLString): {
    start: number;
    end: number;
} {
    const start = htmlText.indexOf("{{");
    let stack = 0;

    for (let i = start; i < htmlText.length; i++) {
        if (htmlText.slice(i, i + 2) === "{{") {
            stack++;
            i++;
        } else if (htmlText.slice(i, i + 2) === "}}") {
            stack--;
            i++;
        }

        if (stack === 0) {
            return { start, end: i };
        }
    }

    return { start, end: -1 };
}
