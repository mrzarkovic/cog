import { getChangedAttributes } from "../attributes/getChangedAttributes";
import { handleBooleanAttribute } from "../attributes/handleBooleanAttribute";
import { ReactiveNodesList, State } from "../types";
import { findNodes } from "./findNodes";
import { isCustomElement } from "./isCustomElement";
import { registerReactiveNode } from "./registerReactiveNode";

export const registerNativeElements = (
    rootElement: Node,
    state: State,
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
        element.innerHTML = element.innerHTML.trim();
        const template = element.outerHTML;

        const newElement = registerReactiveNode(
            elementId,
            reactiveNodes,
            element,
            template,
            state
        );

        const attributes = getChangedAttributes(element, newElement);
        for (let i = 0; i < attributes.length; i++) {
            handleBooleanAttribute(newElement, attributes[i]);
        }
    }
};
