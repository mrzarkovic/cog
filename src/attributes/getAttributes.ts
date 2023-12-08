import { Attribute } from "../types";
import { extractTemplateExpressions } from "../html/evaluateTemplate";

export const getAttributes = (element: HTMLElement): Attribute[] => {
    const attributes = Array.from(element.attributes).map((attribute) => {
        const expressions = extractTemplateExpressions(attribute.value);
        return {
            name: attribute.name,
            value: attribute.value,
            expressions,
            reactive: !!expressions.length,
        };
    });

    return attributes;
};
