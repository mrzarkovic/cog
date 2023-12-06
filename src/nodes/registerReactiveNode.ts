import { Attribute, Expression, ReactiveNodesList } from "../types";

export function registerReactiveNode(
    elementId: number,
    reactiveNodes: ReactiveNodesList,
    element: HTMLElement,
    originalInvocation: string,
    lastTemplateEvaluation: string | null,
    attributes: Attribute[] = [],
    parentId: number | null = null,
    expressions: Expression[] = []
) {
    reactiveNodes.add({
        id: elementId,
        parentId,
        element,
        template: originalInvocation,
        lastTemplateEvaluation,
        attributes,
        expressions,
        shouldUpdate: false,
    });
}
