import { ChangedAttribute } from "../types";

export function handleBooleanAttribute(
    changedNode: HTMLElement,
    attribute: ChangedAttribute
) {
    if (attribute.name.startsWith("data-attribute-")) {
        const optionalAttribute = attribute.name.substring(15); // "data-attribute-".length

        if (attribute.newValue) {
            changedNode.setAttribute(
                optionalAttribute,
                attribute.newValue as string
            );
        } else {
            changedNode.removeAttribute(optionalAttribute);
        }
    }
}
