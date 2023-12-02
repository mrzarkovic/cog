import { ChangedAttribute, ReactiveNodesList, State } from "../types";
import { addAllEventListeners } from "../eventListeners/addAllEventListeners";
import { removeAllEventListeners } from "../eventListeners/removeAllEventListeners";
import { attributesToState } from "../attributes/attributesToState";
import { compareNodes } from "./compareNodes";
import { elementFromString } from "./elementFromString";
import { evaluateTemplate } from "../html/evaluateTemplate";
import { findCorrespondingNode } from "./findCorrespondingNode";
import { isCustomElement } from "./isCustomElement";

const updateElement = (
    changedNode: HTMLElement,
    newNode: HTMLElement,
    content: string | undefined,
    attributes: ChangedAttribute[] | undefined,
    localState: State
) => {
    if (isCustomElement(newNode)) {
        changedNode.parentElement?.replaceChild(newNode, changedNode);
    } else {
        if (content !== undefined) {
            if (changedNode.nodeType === Node.TEXT_NODE) {
                changedNode.textContent = content;
            } else {
                removeAllEventListeners(changedNode);
                changedNode.innerHTML = content;
                addAllEventListeners(changedNode, localState);
            }
        } else if (attributes !== undefined) {
            for (let i = 0; i < attributes.length; i++) {
                if (attributes[i].name.startsWith("data-attribute-")) {
                    const optionalAttribute = attributes[i].name.substring(15); // "data-attribute-".length
                    if (attributes[i].newValue) {
                        changedNode.setAttribute(
                            optionalAttribute,
                            attributes[i].newValue as string
                        );
                    } else {
                        changedNode.removeAttribute(optionalAttribute);
                    }
                }
                changedNode.setAttribute(
                    attributes[i].name,
                    attributes[i].newValue as string
                );
            }
        }
    }
};

export const reconcile = (reactiveNodes: ReactiveNodesList, state: State) => {
    for (
        let treeNodeIndex = 0;
        treeNodeIndex < reactiveNodes.value.length;
        treeNodeIndex++
    ) {
        const { element, template, parentAttributes, lastTemplateEvaluation } =
            reactiveNodes.value[treeNodeIndex];
        const localState = attributesToState(parentAttributes, state);
        const updatedContent = evaluateTemplate(template, localState);
        const newElement = elementFromString(updatedContent);
        const oldElement = elementFromString(lastTemplateEvaluation);
        const changedNodes = compareNodes(oldElement, newElement);

        if (changedNodes.length > 0) {
            reactiveNodes.updateLastTemplateEvaluation(
                treeNodeIndex,
                updatedContent
            );

            for (let i = 0; i < changedNodes.length; i++) {
                const oldNode = findCorrespondingNode(
                    changedNodes[i].node,
                    oldElement,
                    element
                ) as HTMLElement;

                updateElement(
                    oldNode,
                    changedNodes[i].newNode,
                    changedNodes[i].content,
                    changedNodes[i].attributes,
                    localState
                );
            }
        }
    }
};
