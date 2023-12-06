import { Attribute, ReactiveNodesList } from "../types";

export function registerReactiveNode(
    elementId: number,
    reactiveNodes: ReactiveNodesList,
    element: HTMLElement,
    originalInvocation: string,
    lastTemplateEvaluation: string | null = null,
    attributes: Attribute[] = [],
    parentId: number | null = null
) {
    reactiveNodes.add({
        id: elementId,
        parentId,
        element,
        template: originalInvocation,
        lastTemplateEvaluation,
        attributes,
    });
}
