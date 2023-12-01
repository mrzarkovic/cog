// TODO: rename, not a tree

import { DOMTree, HTMLElementFromTemplate } from "../types";
import { isCustomElement } from "./helpers/isCustomElement";

export const loadTree = (rootElement: Node): DOMTree => {
    const tree: DOMTree = [];
    const xpath =
        "self::*[text()[contains(., '{{')] and text()[contains(., '}}')]] | self::*[@*[contains(., '{{') and contains(., '}}')]] | .//*[text()[contains(., '{{')] and text()[contains(., '}}')]] | .//*[@*[contains(., '{{') and contains(., '}}')]]";

    const result = document.evaluate(
        xpath,
        rootElement,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null
    );
    let element = <HTMLElementFromTemplate>result.iterateNext();

    while (element) {
        if (!isCustomElement(element)) {
            element.lastTemplateEvaluation = element.outerHTML;
            tree.push({
                element,
                template: element.outerHTML,
                parentAttributes: [],
            });
        }

        element = <HTMLElementFromTemplate>result.iterateNext();
    }

    return tree;
};
