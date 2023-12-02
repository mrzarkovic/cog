import { Attribute } from "../types";
import { templateExpressionRegex } from "../expressions/templateExpressionRegex";

export const getAttributes = (element: HTMLElement): Attribute[] => {
    const attributes = Array.from(element.attributes).map((attribute) => {
        const reactiveMatch = templateExpressionRegex.exec(attribute.value);
        return {
            name: attribute.name,
            value: reactiveMatch ? reactiveMatch[1] : attribute.value,
            reactive: !!reactiveMatch,
        };
    });

    return attributes;
};
