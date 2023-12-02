import { evaluateTemplate } from "../html/evaluateTemplate";
import { ReactiveNodesList, State } from "../types";
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
        const originalInvocation = elements[i].outerHTML;
        const evaluatedTemplate = evaluateTemplate(originalInvocation, state);

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = evaluatedTemplate;
        const newElement = tempDiv.firstChild as HTMLElement;

        elements[i].parentNode?.replaceChild(newElement, elements[i]);

        nativeElements.add({
            element: newElement,
            template: originalInvocation,
            lastTemplateEvaluation: evaluatedTemplate,
            parentAttributes: [],
        });
    }
};
