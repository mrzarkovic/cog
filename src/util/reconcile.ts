import { ChangedAttribute, ReactiveNodesStack, State } from "../types";
import { addAllEventListeners } from "./eventListeners/addAllEventListeners";
import { removeAllEventListeners } from "./eventListeners/removeAllEventListeners";
import { attributesToState } from "./helpers/attributesToState";
import { compareNodes } from "./helpers/compareNodes";
import { elementFromString } from "./helpers/elementFromString";
import { evaluateTemplate } from "./helpers/evaluateTemplate";
import { findCorrespondingNode } from "./helpers/findCorrespondingNode";
import { isCustomElement } from "./helpers/isCustomElement";

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
                changedNode.setAttribute(
                    attributes[i].name,
                    attributes[i].newValue
                );
            }
        }
    }
};

export const reconcile = (reactiveNodes: ReactiveNodesStack, state: State) => {
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
