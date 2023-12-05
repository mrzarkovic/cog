import { Attribute, ReactiveNodesList } from "../types";

export function registerReactiveNode(
    elementId: number,
    reactiveNodes: ReactiveNodesList,
    element: HTMLElement,
    originalInvocation: string,
    attributes: Attribute[] = []
) {
    const parentId = element.dataset.parentId
        ? Number(element.dataset.parentId)
        : null;

    reactiveNodes.add({
        id: elementId,
        parentId,
        element,
        template: originalInvocation,
        lastTemplateEvaluation: null,
        attributes,
    });
    reactiveNodes.clean(reactiveNodes.list);
}
