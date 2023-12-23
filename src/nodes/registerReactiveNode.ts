import { convertAttributeName } from "../attributes/convertAttributeName";
import {
    evaluateTemplate,
    extractTemplateExpressions,
} from "../html/evaluateTemplate";
import {
    Attribute,
    CogHTMLElement,
    Expression,
    ReactiveNodesList,
    State,
} from "../types";
import { elementFromString } from "./elementFromString";

export function assignDependents(
    elementId: number,
    expressions: Expression[],
    state: State
) {
    expressions.map((expression) => {
        expression.dependencies.forEach((dependency) => {
            if (state[dependency].dependents.indexOf(elementId) === -1) {
                state[dependency].dependents.push(elementId);
            }
        });
    });
}

export function assignDependents2(
    elementId: number,
    expressions: Expression[],
    attributes: Attribute[]
) {
    expressions.map((expression) => {
        expression.dependencies.forEach((dependency) => {
            const attribute = attributes.find(
                (attribute) =>
                    convertAttributeName(attribute.name) === dependency
            );
            if (attribute) {
                if (!attribute.dependents) {
                    attribute.dependents = [];
                }
                if (attribute.dependents.indexOf(elementId) === -1) {
                    attribute.dependents.push(elementId);
                }
            }
        });
    });
}

export function registerReactiveNode(
    elementId: number,
    reactiveNodes: ReactiveNodesList,
    originalElement: HTMLElement,
    template: string,
    state: State,
    attributes: Attribute[] = [],
    parentId: number | null = null,
    templateName: string | null = null
) {
    const refinedTemplate = template.replace(/>\s*([\s\S]*?)\s*</g, ">$1<");

    const expressions = extractTemplateExpressions(refinedTemplate, state);

    const updatedContent = evaluateTemplate(
        refinedTemplate,
        expressions,
        state,
        []
    );

    const element = elementFromString(updatedContent);

    assignDependents(elementId, expressions, state);
    assignDependents2(elementId, expressions, attributes);

    reactiveNodes.add({
        id: elementId,
        parentId,
        element,
        template: refinedTemplate,
        lastTemplateEvaluation: element.cloneNode(true) as CogHTMLElement,
        attributes,
        expressions,
        shouldUpdate: false,
        newAttributes: [],
        templateName,
    });

    originalElement.parentElement?.replaceChild(element, originalElement);

    return element;
}
