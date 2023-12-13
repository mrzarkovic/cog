import {
    Attribute,
    ChangedAttribute,
    ChangedNode,
    CogHTMLElement,
    ReactiveNode,
    ReactiveNodesList,
    State,
} from "../types";
import { addAllEventListeners } from "../eventListeners/addAllEventListeners";
import { removeAllEventListeners } from "../eventListeners/removeAllEventListeners";

import { compareNodes } from "./compareNodes";
import { elementFromString } from "./elementFromString";
import { evaluateTemplate } from "../html/evaluateTemplate";
import { findCorrespondingNode } from "./findCorrespondingNode";
import { handleBooleanAttribute } from "../attributes/handleBooleanAttribute";
import { isCustomElement } from "./isCustomElement";
import { getAttributes } from "../attributes/getAttributes";
import { getLocalState } from "../attributes/getLocalState";

function mergeAttributes(oldArray: Attribute[], newArray: Attribute[]) {
    const merged = oldArray.concat(newArray);
    const attributes: Record<string, Attribute> = {};
    for (let i = 0; i < merged.length; i++) {
        attributes[merged[i].name] = merged[i];
    }

    return Object.values(attributes);
}

function handleCustomElement(
    id: number,
    changedNode: HTMLElement,
    originalNode: CogHTMLElement,
    content: string | undefined,
    attributes: ChangedAttribute[] | undefined,
    reactiveNodes: ReactiveNodesList
) {
    const changedAttributes = attributes?.slice() ?? [];

    let newAttributes: Attribute[] = [];
    if (changedAttributes.length) {
        newAttributes = getAttributes(changedNode);
    }
    if (content !== undefined) {
        newAttributes.push({
            name: "children",
            value: content,
            expressions: [],
            reactive: false,
        });
    }

    if (newAttributes.length) {
        const nodeIndex = reactiveNodes.index[originalNode.cogAnchorId];
        const reactiveNode = reactiveNodes.list[nodeIndex];
        const mergedAttributes = mergeAttributes(
            reactiveNode.attributes,
            newAttributes
        );

        reactiveNodes.update(id, "attributes", mergedAttributes);
    }
}

function handleContentChange(
    originalNode: CogHTMLElement,
    content: string,
    localState: State
) {
    if (originalNode.nodeType === Node.TEXT_NODE) {
        originalNode.textContent = content;
    } else {
        removeAllEventListeners(originalNode);
        originalNode.innerHTML = content;
        addAllEventListeners(originalNode, localState);
    }
}

function handleAttributeChange(
    originalNode: CogHTMLElement,
    attributes: ChangedAttribute[]
) {
    for (let i = 0; i < attributes.length; i++) {
        handleBooleanAttribute(originalNode, attributes[i]);
        originalNode.setAttribute(
            attributes[i].name,
            attributes[i].newValue as string
        );
    }
}

function handleChildrenAddition(
    originalNode: CogHTMLElement,
    addChildren: HTMLElement[]
) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < addChildren.length; i++) {
        fragment.appendChild(addChildren[i]);
    }
    originalNode.appendChild(fragment);
}

function handleChildrenRemoval(
    originalNode: CogHTMLElement,
    removeChildren: HTMLElement[]
) {
    for (let i = 0; i < removeChildren.length; i++) {
        originalNode.removeChild(removeChildren[i]);
    }
}

const updateElement = (
    id: number,
    originalNode: CogHTMLElement,
    changedNode: HTMLElement,
    content: string | undefined,
    attributes: ChangedAttribute[] | undefined,
    addChildren: HTMLElement[],
    removeChildren: HTMLElement[],
    localState: State,
    reactiveNodes: ReactiveNodesList
) => {
    if (isCustomElement(changedNode)) {
        handleCustomElement(
            id,
            changedNode,
            originalNode,
            content,
            attributes,
            reactiveNodes
        );
        return;
    }

    if (content !== undefined) {
        handleContentChange(originalNode, content, localState);
    } else if (attributes !== undefined) {
        handleAttributeChange(originalNode, attributes);
    } else if (addChildren.length) {
        handleChildrenAddition(originalNode, addChildren);
    } else if (removeChildren.length) {
        handleChildrenRemoval(originalNode, removeChildren);
    }
};

const stateVariableUsageRegex = (key: string) =>
    new RegExp(`\\b${key}\\b|[^\\w]${key}[^\\w]`, "gm");

function checkIfChangedStateIsUsedInExpression(
    updatedStateKeys: string[],
    expression: string
) {
    return updatedStateKeys
        .map(stateVariableUsageRegex)
        .some((re) => re.test(expression));
}

function handleNodeChanges(
    id: number,
    changedNodes: ChangedNode[],
    oldElement: CogHTMLElement,
    newElement: CogHTMLElement,
    element: HTMLElement,
    localState: State,
    reactiveNodes: ReactiveNodesList
) {
    for (let i = 0; i < changedNodes.length; i++) {
        const originalNode = findCorrespondingNode(
            changedNodes[i].node,
            newElement,
            element
        ) as CogHTMLElement;

        const { addChildren, removeChildren } = handleChildrenChanges(
            changedNodes[i],
            oldElement,
            element
        );

        updateElement(
            id,
            originalNode,
            changedNodes[i].node,
            changedNodes[i].content,
            changedNodes[i].attributes,
            addChildren,
            removeChildren,
            localState,
            reactiveNodes
        );
    }
}

function handleChildrenChanges(
    changedNode: ChangedNode,
    oldElement: CogHTMLElement,
    element: HTMLElement
) {
    const removeChildren = [];
    let addChildren: HTMLElement[] = [];

    if (changedNode.toBeAdded !== undefined) {
        addChildren = changedNode.toBeAdded!;
    }

    if (changedNode.toBeRemoved !== undefined) {
        for (let i = 0; i < changedNode.toBeRemoved!.length; i++) {
            const child = findCorrespondingNode(
                changedNode.toBeRemoved![i],
                oldElement,
                element
            ) as HTMLElement;
            if (child) {
                removeChildren.push(child);
            }
        }
    }

    return { addChildren, removeChildren };
}

function nodeNeedsUpdate(updatedStateKeys: string[], node: ReactiveNode) {
    if (node.shouldUpdate) {
        return true;
    }

    return checkIfChangedStateIsUsedInExpression(
        updatedStateKeys,
        node.updateCheckString
    );
}

export const reconcile = (
    reactiveNodes: ReactiveNodesList,
    nodesToReconcile: ReactiveNode[],
    state: State,
    updatedStateKeys: string[]
) => {
    for (let nodeIndex = 0; nodeIndex < nodesToReconcile.length; nodeIndex++) {
        const {
            id,
            parentId,
            attributes,
            element,
            template,
            lastTemplateEvaluation,
            expressions,
        } = nodesToReconcile[nodeIndex];

        const shouldUpdate = nodeNeedsUpdate(
            updatedStateKeys,
            nodesToReconcile[nodeIndex]
        );

        if (shouldUpdate) {
            reactiveNodes.update(id, "shouldUpdate", false);

            const localState = getLocalState(
                parentId,
                attributes,
                state,
                reactiveNodes.list
            );
            const updatedContent = evaluateTemplate(
                template,
                expressions,
                localState
            );

            const newElement = elementFromString(updatedContent);
            const oldElement = elementFromString(lastTemplateEvaluation);
            const changedNodes = compareNodes(oldElement, newElement);

            if (changedNodes.length > 0) {
                reactiveNodes.update(
                    id,
                    "lastTemplateEvaluation",
                    updatedContent
                );

                handleNodeChanges(
                    id,
                    changedNodes,
                    oldElement,
                    newElement,
                    element,
                    localState,
                    reactiveNodes
                );
            }
        }
    }
};
