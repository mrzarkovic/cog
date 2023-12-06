import { sanitizeHtml } from "../html/sanitizeHtml";
import { ReactiveNodesList } from "../types";
import { isCustomElement } from "./isCustomElement";
import { registerReactiveNode } from "./registerReactiveNode";

export const registerNativeElements = (
    rootElement: Node,
    reactiveNodes: ReactiveNodesList
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
        const elementId = reactiveNodes.id();
        const element = elements[i];
        element.innerHTML = sanitizeHtml(element.innerHTML);
        registerReactiveNode(
            elementId,
            reactiveNodes,
            element,
            element.outerHTML,
            element.outerHTML
        );
    }
};

// function generateUUID() {
//     return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
//         /[xy]/g,
//         function (c) {
//             const r = (Math.random() * 16) | 0,
//                 v = c === "x" ? r : (r & 0x3) | 0x8;
//             return v.toString(16);
//         }
//     );
// }
