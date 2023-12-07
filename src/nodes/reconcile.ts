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
import { changedAttributesToAttributes } from "../attributes/getAttributes";
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
    originalNode: CogHTMLElement,
    content: string | undefined,
    attributes: ChangedAttribute[] | undefined,
    reactiveNodes: ReactiveNodesList
) {
    const changedAttributes = attributes?.slice() ?? [];
    if (content !== undefined) {
        changedAttributes.push({
            name: "children",
            newValue: content,
        });
    }
    if (changedAttributes.length) {
        const newAttributes = changedAttributesToAttributes(changedAttributes);
        const nodeIndex = reactiveNodes.index[originalNode.cogAnchorId];
        const reactiveNode = reactiveNodes.list[nodeIndex];

        reactiveNodes.update(
            nodeIndex,
            "attributes",
            mergeAttributes(reactiveNode.attributes, newAttributes)
        );
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
        handleCustomElement(originalNode, content, attributes, reactiveNodes);
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

function getAttributesRecursive(
    parentId: number | null,
    attributes: Attribute[],
    reactiveNodes: ReactiveNode[]
): Attribute[] {
    if (parentId === null) {
        return attributes;
    }
    const parentNode = reactiveNodes.find((rn) => rn.id === parentId);

    const parentAttributes = getAttributesRecursive(
        parentNode!.parentId,
        parentNode!.attributes,
        reactiveNodes
    );

    return parentAttributes.concat(attributes);
}

const stateUsageRegex = (key: string) =>
    new RegExp(`(\\s${key}\\s|{${key}\\s|\\s${key}}|{${key}}|(${key}))`, "gm");

const functionStateUsageRegex = (key: string) =>
    new RegExp(`(${key}.value)`, "gm");

const stateFunctionRegex = (key: string) =>
    new RegExp(`(${key})\\((.*?)\\)`, "gm");

const hasDependencies = (
    updatedStateKeys: string[],
    state: State,
    expression: string
) => {
    const usageRegexes = updatedStateKeys.map(stateUsageRegex);
    const shouldUpdateFromUsage = usageRegexes.some((regex) =>
        regex.test(expression)
    );

    if (shouldUpdateFromUsage) {
        return true;
    }

    const functionRegexes = Object.keys(state).map(stateFunctionRegex);

    const usesFunctions = functionRegexes.flatMap((regex) => {
        const matches = [];
        let match;
        while ((match = regex.exec(expression)) !== null) {
            matches.push(match[1]);
        }
        return matches;
    });

    for (let i = 0; i < usesFunctions.length; i++) {
        const functionBody = (state[usesFunctions[i]] as object).toString();
        const functionBodyUsageRegexes = updatedStateKeys.map(
            functionStateUsageRegex
        );
        const usesFunctionBody = functionBodyUsageRegexes.some((regex) =>
            regex.test(functionBody)
        );
        if (usesFunctionBody) {
            return true;
        }
    }

    return false;
};

function handleNodeChanges(
    changedNodes: ChangedNode[],
    oldElement: CogHTMLElement,
    element: HTMLElement,
    localState: State,
    reactiveNodes: ReactiveNodesList
) {
    for (let i = 0; i < changedNodes.length; i++) {
        const originalNode = findCorrespondingNode(
            changedNodes[i].node,
            oldElement,
            element
        ) as CogHTMLElement;

        const { addChildren, removeChildren } = handleChildrenChanges(
            changedNodes[i],
            oldElement,
            element
        );

        updateElement(
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

export const reconcile = (
    reactiveNodes: ReactiveNodesList,
    state: State,
    updatedStateKeys: string[]
) => {
    for (
        let treeNodeIndex = 0;
        treeNodeIndex < reactiveNodes.value.length;
        treeNodeIndex++
    ) {
        const {
            parentId,
            attributes,
            element,
            template,
            lastTemplateEvaluation,
            expressions,
            shouldUpdate,
        } = reactiveNodes.value[treeNodeIndex];

        const attributesRecursive = getAttributesRecursive(
            parentId,
            attributes,
            reactiveNodes.list
        );

        const stateUpdateAffects = hasDependencies(
            updatedStateKeys,
            state,
            template + " " + attributesRecursive.map((a) => a.value).join(" ")
        );

        if (!stateUpdateAffects && !shouldUpdate) {
            continue;
        } else {
            reactiveNodes.update(treeNodeIndex, "shouldUpdate", false);
        }

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
                treeNodeIndex,
                "lastTemplateEvaluation",
                updatedContent
            );

            handleNodeChanges(
                changedNodes,
                oldElement,
                element,
                localState,
                reactiveNodes
            );
        }
    }
};
