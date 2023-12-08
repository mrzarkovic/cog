import { ChangedAttribute } from "../types";

export function handleBooleanAttribute(
    changedNode: HTMLElement,
    attribute: ChangedAttribute
) {
    if (attribute.name.startsWith("data-attribute-")) {
        const optionalAttribute = attribute.name.substring(15); // "data-attribute-".length

        if (attribute.newValue) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (changedNode as any)[optionalAttribute] = true;
            changedNode.setAttribute(
                optionalAttribute,
                attribute.newValue as string
            );
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (changedNode as any)[optionalAttribute] = false;
            changedNode.removeAttribute(optionalAttribute);
        }
    }
}
