import {
    evaluateTemplate,
    extractTemplateExpressions,
} from "../html/evaluateTemplate";
import { Attribute, ReactiveNodesList, State } from "../types";
import { elementFromString } from "./elementFromString";

export function registerReactiveNode(
    elementId: number,
    reactiveNodes: ReactiveNodesList,
    originalElement: HTMLElement,
    template: string,
    state: State,
    attributes: Attribute[] = [],
    parentId: number | null = null
) {
    const expressions = extractTemplateExpressions(template);
    const updatedContent = evaluateTemplate(template, expressions, state);
    const element = elementFromString(updatedContent);

    reactiveNodes.add({
        id: elementId,
        parentId,
        element,
        template: template,
        lastTemplateEvaluation: updatedContent,
        attributes,
        expressions,
        shouldUpdate: false,
    });

    originalElement.parentElement?.replaceChild(element, originalElement);

    return element;
}
