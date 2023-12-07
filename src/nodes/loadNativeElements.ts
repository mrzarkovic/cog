import { extractTemplateExpressions } from "../html/evaluateTemplate";

import { ReactiveNodesList } from "../types";
import { findNodes } from "./findNodes";
import { isCustomElement } from "./isCustomElement";
import { registerReactiveNode } from "./registerReactiveNode";

export const registerNativeElements = (
    rootElement: Node,
    reactiveNodes: ReactiveNodesList
) => {
    const elements = findNodes<HTMLElement>(
        rootElement,
        "self::*[text()[contains(., '{{')] and text()[contains(., '}}')]] | self::*[@*[contains(., '{{') and contains(., '}}')]] | .//*[text()[contains(., '{{')] and text()[contains(., '}}')]] | .//*[@*[contains(., '{{') and contains(., '}}')]]",
        (element) => !isCustomElement(element)
    );

    for (let i = 0; i < elements.length; i++) {
        const elementId = reactiveNodes.id();
        const element = elements[i];

        // element.innerHTML = sanitizeHtml(element.innerHTML);
        element.innerHTML = element.innerHTML.trim();
        const template = element.outerHTML;
        const expressions = extractTemplateExpressions(template);

        registerReactiveNode(
            elementId,
            reactiveNodes,
            element,
            template,
            template.indexOf("data-attribute") !== -1 ? template : null,
            [],
            null,
            expressions
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
