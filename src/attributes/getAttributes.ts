import { Attribute, ChangedAttribute } from "../types";
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

export const changedAttributesToAttributes = (
    changedAttributes: ChangedAttribute[]
): Attribute[] => {
    return changedAttributes.map((attribute) => {
        const expressions = extractTemplateExpressions(
            attribute.newValue as string
        );

        return {
            name: attribute.name,
            value: attribute.newValue as string,
            expressions,
            reactive: !!expressions.length,
        };
    });
};
