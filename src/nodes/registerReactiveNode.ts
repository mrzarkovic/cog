import { getAttributesRecursive } from "../attributes/getAttributesRecursive";
import {
    evaluateTemplate,
    extractTemplateExpressions,
} from "../html/evaluateTemplate";
import { removeTagsAndAttributeNames } from "../html/removeTagsAndAttributeNames";
import {
    Attribute,
    CogHTMLElement,
    ReactiveNode,
    ReactiveNodesList,
    State,
} from "../types";
import { elementFromString } from "./elementFromString";

function assignDependents(
    elementId: number,
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
    const templateAndAttributesString =
        template + " " + attributesRecursive.map((a) => a.value).join(" ");
    const uniqueIndex: Record<string, boolean> = {};

    extractTemplateExpressions(templateAndAttributesString).map((expression) =>
        removeTagsAndAttributeNames(expression.value)
            .split("@")
            .filter((wordFromExpression) =>
                uniqueIndex[wordFromExpression]
                    ? false
                    : (uniqueIndex[wordFromExpression] = true)
            )
            .filter(
                (wordFromExpression) =>
                    state[wordFromExpression] &&
                    state[wordFromExpression].dependents.indexOf(elementId) ===
                        -1
            )
            .forEach((wordFromExpression) => {
                state[wordFromExpression].dependents.push(elementId);
            })
    );
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

    assignDependents(
        elementId,
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
        lastTemplateEvaluation: element.cloneNode(true) as CogHTMLElement,
        attributes,
        expressions,
        shouldUpdate: false,
    });

    originalElement.parentElement?.replaceChild(element, originalElement);

    return element;
}
