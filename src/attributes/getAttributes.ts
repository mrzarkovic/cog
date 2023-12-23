import { Attribute, State } from "../types";
import { extractTemplateExpressions } from "../html/evaluateTemplate";

export const getAttributes = (
    element: HTMLElement,
    state: State
): Attribute[] => {
    const attributes = Array.from(element.attributes).map((attribute) => {
        const expressions = extractTemplateExpressions(attribute.value, state);

        return {
            name: attribute.name,
            value: attribute.value,
            expressions,
            reactive: !!expressions.length,
            dependents: [],
        };
    });

    return attributes;
};
