import { ReactiveNode, State } from "../types";
import { addAllEventListeners } from "./eventListeners/addAllEventListeners";
import { removeAllEventListeners } from "./eventListeners/removeAllEventListeners";
import { attributesToState } from "./helpers/attributesToState";
import { compareNodes } from "./helpers/compareNodes";
import { elementFromString } from "./helpers/elementFromString";
import { evaluateTemplate } from "./helpers/evaluateTemplate";
import { findCorrespondingNode } from "./helpers/findCorrespondingNode";
import { isCustomElement } from "./helpers/isCustomElement";

export const renderTemplates = (tree: ReactiveNode[], state: State) => {
    let treeNodeIndex = 0;
    for (treeNodeIndex; treeNodeIndex < tree.length; treeNodeIndex++) {
        const { element, template, parentAttributes } = tree[treeNodeIndex];
        const localState = attributesToState(parentAttributes, state);
        const updatedContent = evaluateTemplate(template, localState);
        const newElement = elementFromString(updatedContent);
        const oldElement = elementFromString(
            element.lastTemplateEvaluation ?? element.outerHTML
        );
        const changedElements = compareNodes(oldElement, newElement);

        if (changedElements.length > 0) {
            element.lastTemplateEvaluation = updatedContent;

            changedElements.map(
                ({
                    element: changedTarget,
                    newElement,
                    content,
                    attributes,
                }) => {
                    const changedElement = findCorrespondingNode(
                        changedTarget,
                        oldElement,
                        element
                    ) as HTMLElement;

                    if (changedElement) {
                        if (
                            changedTarget.nodeType !== Node.TEXT_NODE &&
                            isCustomElement(changedTarget)
                        ) {
                            changedElement.parentElement?.replaceChild(
                                newElement,
                                changedElement
                            );
                        } else {
                            if (content !== undefined) {
                                if (
                                    changedElement.nodeType === Node.TEXT_NODE
                                ) {
                                    changedElement.textContent = content;
                                } else {
                                    removeAllEventListeners(changedElement);
                                    changedElement.innerHTML = content;
                                    addAllEventListeners(
                                        changedElement,
                                        localState
                                    );
                                }
                            } else if (attributes !== undefined) {
                                attributes.map(({ name, newValue }) => {
                                    changedElement.setAttribute(name, newValue);
                                });
                            }
                        }
                    }
                }
            );
        }
    }
};
