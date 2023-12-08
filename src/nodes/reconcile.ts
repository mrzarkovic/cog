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

        reactiveNodes.update(nodeIndex, "attributes", mergedAttributes);
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
        handleCustomElement(
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

// const functionStateUsageRegex = (key: string) =>
//     new RegExp(`(${key}.value)`, "gm");

const stateFunctionRegex = (key: string) =>
    new RegExp(`(${key})\\((.*?)\\)`, "gm");

function findInString(
    items: string[],
    string: string,
    regexFactory: (key: string) => RegExp
) {
    const regexes = items.map(regexFactory);
    const found = regexes.some((re) => re.test(string));

    return found;
}

function checkIfChangedStateIsUsedInExpression(
    updatedStateKeys: string[],
    expression: string
) {
    return findInString(updatedStateKeys, expression, stateUsageRegex);
}

function checkIfChangedStateIsUsedInFunctionUsedInExpression(
    state: State,
    expression: string
) {
    const functionRegexes = Object.keys(state).map(stateFunctionRegex);
    const usesFunctions = functionRegexes.flatMap((regex) => {
        const matches = [];
        let match;
        while ((match = regex.exec(expression)) !== null) {
            matches.push(match[1]);
        }
        return matches;
    });

    return usesFunctions;

    // for (let i = 0; i < usesFunctions.length; i++) {
    //     const functionBody = (state[usesFunctions[i]] as object).toString();
    //     const usesInFunctionBody = findInString(
    //         updatedStateKeys,
    //         functionBody,
    //         functionStateUsageRegex
    //     );

    //     if (usesInFunctionBody) {
    //         return true;
    //     }
    // }

    // return false;
}

const hasDependencies = (
    updatedStateKeys: string[],
    state: State,
    expression: string
) => {
    const stateUsedInExpression = checkIfChangedStateIsUsedInExpression(
        updatedStateKeys,
        expression
    );
    if (stateUsedInExpression) {
        return true;
    }

    const functionThatUsesStateUsedInExpression =
        checkIfChangedStateIsUsedInFunctionUsedInExpression(state, expression);

    if (functionThatUsesStateUsedInExpression) {
        return true;
    }

    return false;
};

function handleNodeChanges(
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

function nodeNeedsUpdate(
    state: State,
    updatedStateKeys: string[],
    node: ReactiveNode,
    nodes: ReactiveNode[]
) {
    if (node.shouldUpdate) {
        return true;
    }

    const attributesRecursive = getAttributesRecursive(
        node.parentId,
        node.attributes,
        nodes
    );

    return hasDependencies(
        updatedStateKeys,
        state,
        node.template + " " + attributesRecursive.map((a) => a.value).join(" ")
    );
}

export const reconcile = (
    reactiveNodes: ReactiveNodesList,
    state: State,
    updatedStateKeys: string[]
) => {
    for (
        let nodeIndex = 0;
        nodeIndex < reactiveNodes.value.length;
        nodeIndex++
    ) {
        const {
            parentId,
            attributes,
            element,
            template,
            lastTemplateEvaluation,
            expressions,
        } = reactiveNodes.value[nodeIndex];

        const shouldUpdate = nodeNeedsUpdate(
            state,
            updatedStateKeys,
            reactiveNodes.value[nodeIndex],
            reactiveNodes.value
        );

        if (!shouldUpdate) {
            continue;
        } else {
            reactiveNodes.update(nodeIndex, "shouldUpdate", false);
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
                nodeIndex,
                "lastTemplateEvaluation",
                updatedContent
            );

            handleNodeChanges(
                changedNodes,
                oldElement,
                newElement,
                element,
                localState,
                reactiveNodes
            );
        }
    }
};
