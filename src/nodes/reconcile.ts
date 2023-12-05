import {
    ChangedAttribute,
    ReactiveNode,
    ReactiveNodesList,
    State,
} from "../types";
import { addAllEventListeners } from "../eventListeners/addAllEventListeners";
import { removeAllEventListeners } from "../eventListeners/removeAllEventListeners";
import { attributesToState } from "../attributes/attributesToState";
import { compareNodes } from "./compareNodes";
import { elementFromString } from "./elementFromString";
import { evaluateTemplate } from "../html/evaluateTemplate";
import { findCorrespondingNode } from "./findCorrespondingNode";
import { handleBooleanAttribute } from "../attributes/handleBooleanAttribute";

const updateElement = (
    changedNode: HTMLElement,
    content: string | undefined,
    attributes: ChangedAttribute[] | undefined,
    childAdded: HTMLElement | undefined,
    removeChildren: HTMLElement[],
    localState: State
) => {
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
            handleBooleanAttribute(changedNode, attributes[i]);
            changedNode.setAttribute(
                attributes[i].name,
                attributes[i].newValue as string
            );
        }
    } else if (childAdded !== undefined) {
        changedNode.appendChild(childAdded);
    } else if (removeChildren.length) {
        for (let i = 0; i < removeChildren.length; i++) {
            changedNode.removeChild(removeChildren[i]);
        }
    }
};

function getLocalState(
    node: ReactiveNode,
    globalState: State,
    reactiveNodes: ReactiveNode[]
) {
    if (node.parentId === null) {
        return attributesToState(node.attributes, globalState);
    }

    const parentNode = reactiveNodes.find((rn) => rn.id === node.parentId);

    const parentState: State = getLocalState(
        parentNode!,
        globalState,
        reactiveNodes
    );

    return Object.assign(
        {},
        parentState,
        attributesToState(node.attributes, parentState)
    );
}

export const reconcile = (reactiveNodes: ReactiveNodesList, state: State) => {
    for (
        let treeNodeIndex = 0;
        treeNodeIndex < reactiveNodes.value.length;
        treeNodeIndex++
    ) {
        const { element, template, lastTemplateEvaluation } =
            reactiveNodes.value[treeNodeIndex];

        const localState = getLocalState(
            reactiveNodes.value[treeNodeIndex],
            state,
            reactiveNodes.list
        );

        const updatedContent = evaluateTemplate(template, localState);
        const newElement = elementFromString(updatedContent);

        if (lastTemplateEvaluation === null) {
            reactiveNodes.update(
                treeNodeIndex,
                "lastTemplateEvaluation",
                updatedContent
            );
            reactiveNodes.update(treeNodeIndex, "element", newElement);
            element.parentNode?.replaceChild(newElement, element);
        } else {
            const oldElement = elementFromString(lastTemplateEvaluation);
            const changedNodes = compareNodes(oldElement, newElement);
            console.log({ changedNodes });

            if (changedNodes.length > 0) {
                reactiveNodes.update(
                    treeNodeIndex,
                    "lastTemplateEvaluation",
                    updatedContent
                );

                for (let i = 0; i < changedNodes.length; i++) {
                    const oldNode = findCorrespondingNode(
                        changedNodes[i].node,
                        oldElement,
                        element
                    ) as HTMLElement;
                    let removeChildren = [];

                    if (changedNodes[i].toBeRemoved !== undefined) {
                        for (
                            let j = 0;
                            j < changedNodes[i].toBeRemoved.length;
                            j++
                        ) {
                            removeChildren.push(
                                findCorrespondingNode(
                                    changedNodes[i].toBeRemoved[j],
                                    oldElement,
                                    element
                                )
                            );
                        }
                    }

                    console.log({ removeChildren });

                    updateElement(
                        oldNode,
                        changedNodes[i].content,
                        changedNodes[i].attributes,
                        changedNodes[i].childAdded,
                        removeChildren,
                        localState
                    );
                }
            }
        }
    }
};
