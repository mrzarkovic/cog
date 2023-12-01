import { ReactiveNodesStack } from "../types";
import { isCustomElement } from "./helpers/isCustomElement";

export const loadNativeElements = (
    rootElement: Node,
    nativeElements: ReactiveNodesStack
) => {
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
            nativeElements.add({
                element,
                template: element.outerHTML,
                lastTemplateEvaluation: element.outerHTML,
                parentAttributes: [],
            });
        }

        element = <HTMLElement>result.iterateNext();
    }
};
