import { getAttributesRecursive } from "../attributes/getAttributesRecursive";
import {
    evaluateTemplate,
    extractTemplateExpressions,
} from "../html/evaluateTemplate";
import { removeTagsAndAttributeNames } from "../html/removeTagsAndAttributeNames";
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

    const attributesRecursive = getAttributesRecursive(
        parentId,
        attributes,
        reactiveNodes.list
    );

    const templateForUpdateCheck =
        template + " " + attributesRecursive.map((a) => a.value).join(" ");
    const expression = extractTemplateExpressions(templateForUpdateCheck)
        .map((e) => e.value)
        .join(" ");
    const updateCheckString = removeTagsAndAttributeNames(expression);

    reactiveNodes.add({
        id: elementId,
        parentId,
        element,
        template: template,
        lastTemplateEvaluation: updatedContent,
        updateCheckString,
        attributes,
        expressions,
        shouldUpdate: false,
    });

    originalElement.parentElement?.replaceChild(element, originalElement);

    return element;
}
