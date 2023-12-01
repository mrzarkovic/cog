export function getChangedAttributes(
    oldElement: HTMLElement,
    newElement: HTMLElement
): Array<{ name: string; newValue: string }> {
    const changedAttributes: Array<{ name: string; newValue: string }> = [];

    for (let i = 0; i < oldElement.attributes.length; i++) {
        const oldAttr = oldElement.attributes[i];
        const newAttrValue = newElement.getAttribute(oldAttr.name);
        if (newAttrValue !== oldAttr.value) {
            changedAttributes.push({
                name: oldAttr.name,
                newValue: newAttrValue || "",
            });
        }
    }

    return changedAttributes;
}
