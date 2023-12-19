import { Attribute, ReactiveNode } from "../types";

export function getAttributesRecursive(
    parentId: number | null,
    attributes: Attribute[],
    reactiveNodes: ReactiveNode[]
): Attribute[] {
    if (parentId === null) {
        return attributes;
    }
    const parentNode = reactiveNodes.find((rn) => rn.id === parentId);

    const parentAttributes = getAttributesRecursive(
        parentNode!.parentId,
        parentNode!.attributes,
        reactiveNodes
    );

    return parentAttributes.concat(attributes);
}
