import { Attribute, ChangedAttribute } from "../types";
import { templateExpressionRegex } from "../expressions/templateExpressionRegex";

export const getAttributes = (element: HTMLElement): Attribute[] => {
    const attributes = Array.from(element.attributes).map((attribute) => {
        const reactiveMatch = templateExpressionRegex.exec(attribute.value);
        return {
            name: attribute.name,
            value: attribute.value,
            reactive: !!reactiveMatch,
        };
    });

    return attributes;
};

export const changedAttributesToAttributes = (
    changedAttributes: ChangedAttribute[]
): Attribute[] => {
    return changedAttributes.map((attribute) => {
        const reactiveMatch = templateExpressionRegex.exec(
            attribute.newValue as string
        );
        return {
            name: attribute.name,
            value: attribute.newValue as string,
            reactive: !!reactiveMatch,
        };
    });
};
