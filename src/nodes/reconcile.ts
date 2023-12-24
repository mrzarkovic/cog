import {
    Attribute,
    ChangedAttribute,
    ChangedNode,
    CogHTMLElement,
    ReactiveNode,
    ReactiveNodeId,
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
    state: StateObject,
    updatedKeys: string[]
) {
    const changedAttributes = attributes?.slice() ?? [];

    const newAttributes: Attribute[] = [];

    changedAttributes.forEach((attribute) => {
        newAttributes.push({
            name: attribute.name,
            value: attribute.newValue as string,
            expressions: [],
            reactive: false,
            dependents: [],
        });
    });

    if (content !== undefined) {
        newAttributes.push({
            name: "children",
            value: content,
            expressions: [],
            reactive: false,
            dependents: [],
        });
    }

    if (newAttributes.length) {
        const reactiveNode = reactiveNodes.get(originalNode.cogAnchorId);
        if (reactiveNode.element !== null) {
            reconcileReactiveNode(
                reactiveNode,
                reactiveNodes,
                newAttributes,
                state,
                updatedKeys
            );
        } else {
            const attributesDependents: Record<string, ReactiveNodeId[]> = {};
            for (let i = 0; i < reactiveNode.attributes.length; i++) {
                const attribute = reactiveNode.attributes[i];
                if (attribute.dependents && attribute.dependents.length) {
                    attributesDependents[attribute.name] = attribute.dependents;
                }
            }
            for (let i = 0; i < newAttributes.length; i++) {
                const attributeDependents =
                    attributesDependents[newAttributes[i].name];
                for (let j = 0; j < attributeDependents.length; j++) {
                    const reactiveNode = reactiveNodes.get(
                        attributeDependents[j]
                    );

                    reconcileReactiveNode(
                        reactiveNode,
                        reactiveNodes,
                        newAttributes,
                        state,
                        updatedKeys
                    );
                }
            }
        }
    }
}

function reconcileReactiveNode(
    reactiveNode: ReactiveNode,
    reactiveNodes: ReactiveNodesList,
    newAttributes: Attribute[],
    state: StateObject,
    updatedKeys: string[]
) {
    const mergedAttributes = mergeAttributes(
        reactiveNode.attributes,
        newAttributes
    );
    reactiveNode.attributes = mergedAttributes;
    reactiveNode.newAttributes = reactiveNode.attributes.map((a) =>
        convertAttributeName(a.name)
    );

    reconcile(reactiveNodes, reactiveNode, state, updatedKeys);
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
    removeChildren: HTMLElement[],
    reactiveNodes: ReactiveNodesList
) {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < removeChildren.length; i++) {
        if ((removeChildren[i] as CogHTMLElement).cogAnchorId) {
            reactiveNodes.remove(
                (removeChildren[i] as CogHTMLElement).cogAnchorId
            );
        }
        fragment.appendChild(removeChildren[i]);
    }

    fragment.textContent = "";
}

function handleNodeChanges(
    changedNodes: ChangedNode[],
    oldElement: CogHTMLElement,
    newElement: CogHTMLElement,
    element: HTMLElement,
    localState: State,
    reactiveNodes: ReactiveNodesList,
    state: StateObject,
    updatedKeys: string[]
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
                state,
                updatedKeys
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
                handleChildrenRemoval(removeChildren, reactiveNodes);
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
    reactiveNode: ReactiveNode,
    state: StateObject,
    stateChanges: string[]
) => {
    const localStateChanges = stateChanges.concat(reactiveNode.newAttributes);
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
        reactiveNodes.list,
        localStateChanges
    );

    const updatedContent = evaluateTemplate(
        reactiveNode.template,
        reactiveNode.expressions,
        localState,
        localStateChanges
    );

    const oldElement = reactiveNode.lastTemplateEvaluation!.cloneNode(
        true
    ) as CogHTMLElement;
    const newElement = elementFromString(updatedContent);

    const changedNodes = compareNodes(oldElement, newElement);

    if (changedNodes.length > 0) {
        reactiveNode.lastTemplateEvaluation = newElement.cloneNode(
            true
        ) as CogHTMLElement;

        handleNodeChanges(
            changedNodes,
            oldElement,
            newElement,
            reactiveNode.element!,
            localState,
            reactiveNodes,
            state,
            stateChanges
        );
    }
};
