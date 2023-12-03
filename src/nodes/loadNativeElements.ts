import { convertAttributeValue } from "../attributes/convertAttributeValue";
import { getAttributes } from "../attributes/getAttributes";
import { handleBooleanAttribute } from "../attributes/handleBooleanAttribute";
import { evaluateExpression } from "../expressions/evaluateExpression";
import { evaluateTemplate } from "../html/evaluateTemplate";
import { ReactiveNodesList, State } from "../types";
import { elementFromString } from "./elementFromString";
import { isCustomElement } from "./isCustomElement";

export const loadNativeElements = (
    rootElement: Node,
    state: State,
    nativeElements: ReactiveNodesList
) => {
    const elements: HTMLElement[] = [];
    const xpath =
        "self::*[text()[contains(., '{{')] and text()[contains(., '}}')]] | self::*[@*[contains(., '{{') and contains(., '}}')]] | .//*[text()[contains(., '{{')] and text()[contains(., '}}')]] | .//*[@*[contains(., '{{') and contains(., '}}')]]";

    const result = document.evaluate(
        xpath,
        rootElement,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null
    );
    let element = <HTMLElement>result.iterateNext();

    while (element) {
        if (!isCustomElement(element)) {
            elements.push(element);
        }

        element = <HTMLElement>result.iterateNext();
    }

    for (let i = 0; i < elements.length; i++) {
        const attributes = getAttributes(elements[i]);
        const originalInvocation = elements[i].outerHTML;
        const evaluatedTemplate = evaluateTemplate(originalInvocation, state);
        const newElement = elementFromString(evaluatedTemplate);

        attributes.map((attribute) =>
            handleBooleanAttribute(newElement, {
                name: attribute.name,
                newValue: convertAttributeValue(
                    attribute.reactive
                        ? evaluateExpression(attribute.value, state)
                        : attribute.value
                ),
            })
        );

        elements[i].parentNode?.replaceChild(newElement, elements[i]);

        nativeElements.add({
            element: newElement,
            template: originalInvocation,
            lastTemplateEvaluation: evaluatedTemplate,
            parentAttributes: [],
        });
    }
};
