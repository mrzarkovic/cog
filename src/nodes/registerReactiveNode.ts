import {
    evaluateTemplate,
    extractTemplateExpressions,
} from "../html/evaluateTemplate";
import { sanitizeHtml } from "../html/sanitizeHtml";
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
    const sanitizedTemplate = sanitizeHtml(template);
    const expressions = extractTemplateExpressions(sanitizedTemplate);

    const updatedContent = evaluateTemplate(
        sanitizedTemplate,
        expressions,
        state
    );

    const element = elementFromString(updatedContent);

    reactiveNodes.add({
        id: elementId,
        parentId,
        element,
        template: sanitizedTemplate,
        lastTemplateEvaluation: updatedContent,
        attributes,
        expressions,
        shouldUpdate: false,
    });

    originalElement.parentElement?.replaceChild(element, originalElement);

    return element;
}
