import { ChangedAttribute } from "../types";
import { convertAttributeValue } from "./convertAttributeValue";

export function getChangedAttributes(
    oldElement: HTMLElement,
    newElement: HTMLElement
): ChangedAttribute[] {
    const changedAttributes: ChangedAttribute[] = [];

    for (let i = 0; i < oldElement.attributes.length; i++) {
        const oldAttr = oldElement.attributes[i];
        const newAttrValue = newElement.getAttribute(oldAttr.name);
        if (newAttrValue !== oldAttr.value) {
            changedAttributes.push({
                name: oldAttr.name,
                newValue: convertAttributeValue(newAttrValue || ""),
            });
        }
    }

    return changedAttributes;
}
