import { ReactiveNode, State } from "../types";
import { addAllEventListeners } from "./eventListeners/addAllEventListeners";
import { removeAllEventListeners } from "./eventListeners/removeAllEventListeners";
import { compareNodes } from "./helpers/compareNodes";
import { convertAttribute } from "./helpers/convertAttribute";
import { evaluateExpression } from "./helpers/evaluateExpression";
import { evaluateTemplate } from "./helpers/evaluateTemplate";
import { findCorrespondingNode } from "./helpers/findCorrespondingNode";
import { isCustomElement } from "./helpers/isCustomElement";

export const renderTemplates = (tree: ReactiveNode[], state: State) => {
    let treeNodeIndex = 0;
    for (treeNodeIndex; treeNodeIndex < tree.length; treeNodeIndex++) {
        const localState: State = { ...state };
        const { element, template, attributes, parentAttributes } =
            tree[treeNodeIndex];

        if (parentAttributes) {
            let i = 0;
            for (i; i < parentAttributes.length; i++) {
                const attribute = parentAttributes[i];
                const name = attribute.name;
                const value = attribute.value;
                const reactive = attribute.reactive;
                const evaluated = reactive
                    ? evaluateExpression(value, localState)
                    : value;

                localState[convertAttribute(name)] = evaluated;
            }
        }

        if (attributes) {
            let i = 0;
            for (i; i < attributes.length; i++) {
                const attribute = attributes[i];
                const name = attribute.name;
                const value = attribute.value;
                const reactive = attribute.reactive;
                const evaluated = reactive
                    ? evaluateExpression(value, localState)
                    : value;

                if (evaluated !== element.getAttribute(name)) {
                    element.setAttribute(name, evaluated);
                }
            }
        }

        const updatedContent = evaluateTemplate(template, localState);
        const parser = new DOMParser();
        const newElementDoc = parser.parseFromString(
            updatedContent,
            "text/html"
        );
        const newElement = newElementDoc.body.firstChild as HTMLElement;
        const oldElementDoc = parser.parseFromString(
            element.lastTemplateEvaluation,
            "text/html"
        );
        const oldElement = oldElementDoc.body.firstChild as HTMLElement;

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
