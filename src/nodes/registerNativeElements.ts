import { getChangedAttributes } from "../attributes/getChangedAttributes";
import { handleBooleanAttribute } from "../attributes/handleBooleanAttribute";
import { ReactiveNodesList, State } from "../types";
import { findReactiveNodes } from "./findNodes";
import { registerReactiveNode } from "./registerReactiveNode";

export const registerNativeElements = (
    rootElement: Node,
    state: State,
    reactiveNodes: ReactiveNodesList
) => {
    const elements = findReactiveNodes(rootElement);

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
