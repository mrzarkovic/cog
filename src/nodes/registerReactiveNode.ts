import { getAttributesRecursive } from "../attributes/getAttributesRecursive";
import {
    evaluateTemplate,
    extractTemplateExpressions,
} from "../html/evaluateTemplate";
import { removeTagsAndAttributeNames } from "../html/removeTagsAndAttributeNames";
import { Attribute, ReactiveNode, ReactiveNodesList, State } from "../types";
import { elementFromString } from "./elementFromString";

function assignDependents(
    state: State,
    parentId: number | null,
    attributes: Attribute[],
    reactiveNodes: ReactiveNode[],
    template: string
) {
    const attributesRecursive = getAttributesRecursive(
        parentId,
        attributes,
        reactiveNodes
    );
    const templateForUpdateCheck =
        template + " " + attributesRecursive.map((a) => a.value).join(" ");
    const expression = extractTemplateExpressions(templateForUpdateCheck)
        .map((e) => e.value)
        .join(" ");
    const updateCheckString = removeTagsAndAttributeNames(expression);
    const index: Record<string, boolean> = {};
    const uniqueWords = updateCheckString
        .split("@")
        .filter((w) => (index[w] ? false : (index[w] = true)));

    for (let i = 0; i < uniqueWords.length; i++) {
        if (state[uniqueWords[i]]) {
            console.log("assignDependents", uniqueWords[i]);
        }
    }
}

export function registerReactiveNode(
    elementId: number,
    reactiveNodes: ReactiveNodesList,
    originalElement: HTMLElement,
    template: string,
    state: State,
    attributes: Attribute[] = [],
    parentId: number | null = null
) {
    const refinedTemplate = template.replace(/>\s*([\s\S]*?)\s*</g, ">$1<");
    const expressions = extractTemplateExpressions(refinedTemplate);
    const updatedContent = evaluateTemplate(
        refinedTemplate,
        expressions,
        state
    );

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

    assignDependents(
        state,
        parentId,
        attributes,
        reactiveNodes.list,
        refinedTemplate
    );

    reactiveNodes.add({
        id: elementId,
        parentId,
        element,
        template: refinedTemplate,
        lastTemplateEvaluation: updatedContent,
        updateCheckString,
        attributes,
        expressions,
        shouldUpdate: false,
    });

    originalElement.parentElement?.replaceChild(element, originalElement);

    return element;
}
