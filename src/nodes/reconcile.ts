import {
    Attribute,
    ChangedAttribute,
    ChangedNode,
    CogHTMLElement,
    ReactiveNode,
    ReactiveNodesList,
    State,
    StateObject,
} from "../types";
import { addAllEventListeners } from "../eventListeners/addAllEventListeners";
import { removeAllEventListeners } from "../eventListeners/removeAllEventListeners";

import { compareNodes } from "./compareNodes";
import { elementFromString } from "./elementFromString";
import { evaluateTemplate } from "../html/evaluateTemplate";
import { findCorrespondingNode } from "./findCorrespondingNode";
import { handleBooleanAttribute } from "../attributes/handleBooleanAttribute";
import { isCustomElement } from "./isCustomElement";
import { getLocalState } from "../attributes/getLocalState";
import { convertAttributeName } from "../attributes/convertAttributeName";

function mergeAttributes(oldArray: Attribute[], newArray: Attribute[]) {
    const merged = oldArray.concat(newArray);
    const attributes: Record<string, Attribute> = {};
    for (let i = 0; i < merged.length; i++) {
        attributes[merged[i].name] = merged[i];
    }

    return Object.values(attributes);
}

function updateCustomElement(
    originalNode: CogHTMLElement,
    content: string | undefined,
    attributes: ChangedAttribute[] | undefined,
    reactiveNodes: ReactiveNodesList,
    nodesToReconcile: ReactiveNode[]
) {
    const changedAttributes = attributes?.slice() ?? [];

    const newAttributes: Attribute[] = [];

    changedAttributes.forEach((attribute) => {
        newAttributes.push({
            name: attribute.name,
            value: attribute.newValue as string,
            expressions: [],
            reactive: false,
        });
    });

    if (content !== undefined) {
        newAttributes.push({
            name: "children",
            value: content,
            expressions: [],
            reactive: false,
        });
    }

    if (newAttributes.length) {
        const reactiveNode = reactiveNodes.get(originalNode.cogAnchorId);
        const mergedAttributes = mergeAttributes(
            reactiveNode.attributes,
            newAttributes
        );
        reactiveNode.attributes = mergedAttributes;
        reactiveNode.newAttributes = reactiveNode.attributes.map((a) =>
            convertAttributeName(a.name)
        );

        if (
            nodesToReconcile.filter((n) => n.id === reactiveNode.id).length == 0
        ) {
            nodesToReconcile.push(reactiveNode);
        }
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

function handleNodeChanges(
    changedNodes: ChangedNode[],
    oldElement: CogHTMLElement,
    newElement: CogHTMLElement,
    element: HTMLElement,
    localState: State,
    reactiveNodes: ReactiveNodesList,
    nodesToReconcile: ReactiveNode[]
) {
    for (let i = 0; i < changedNodes.length; i++) {
        const change = changedNodes[i];
        const originalNode = findCorrespondingNode(
            change.node,
            newElement,
            element
        ) as CogHTMLElement;

        if (isCustomElement(change.node)) {
            updateCustomElement(
                originalNode,
                change.content,
                change.attributes,
                reactiveNodes,
                nodesToReconcile
            );
        } else {
            const { addChildren, removeChildren } = handleChildrenChanges(
                change,
                oldElement,
                element
            );

            if (change.content !== undefined) {
                handleContentChange(originalNode, change.content, localState);
            } else if (change.attributes !== undefined) {
                handleAttributeChange(originalNode, change.attributes);
            } else if (addChildren.length) {
                handleChildrenAddition(originalNode, addChildren);
            } else if (removeChildren.length) {
                handleChildrenRemoval(originalNode, removeChildren);
            }
        }
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

export const reconcile = (
    reactiveNodes: ReactiveNodesList,
    nodesToReconcile: ReactiveNode[],
    state: StateObject,
    stateChanges: string[]
) => {
    for (let nodeIndex = 0; nodeIndex < nodesToReconcile.length; nodeIndex++) {
        const reactiveNode = nodesToReconcile[nodeIndex];
        const localStateChanges = stateChanges.concat(
            reactiveNode.newAttributes
        );
        let completeState = state.value;

        if (
            state.templates &&
            reactiveNode.templateName &&
            state.templates[reactiveNode.templateName]
        ) {
            const templateState =
                state.templates[reactiveNode.templateName].customElements[
                    reactiveNode.id
                ];
            completeState = Object.assign({}, state.value, templateState);
        }

        reactiveNode.newAttributes = [];

        const localState = getLocalState(
            reactiveNode.parentId,
            reactiveNode.attributes,
            completeState,
            localStateChanges,
            nodesToReconcile
        );

        const updatedContent = evaluateTemplate(
            reactiveNode.template,
            reactiveNode.expressions,
            localState,
            localStateChanges
        );

        const oldElement = reactiveNode.lastTemplateEvaluation.cloneNode(
            true
        ) as CogHTMLElement;
        const newElement = elementFromString(updatedContent);

        const changedNodes = compareNodes(oldElement, newElement);

        if (changedNodes.length > 0) {
            nodesToReconcile[nodeIndex].lastTemplateEvaluation =
                newElement.cloneNode(true) as CogHTMLElement;

            handleNodeChanges(
                changedNodes,
                oldElement,
                newElement,
                reactiveNode.element,
                localState,
                reactiveNodes,
                nodesToReconcile
            );
        }
    }
};
