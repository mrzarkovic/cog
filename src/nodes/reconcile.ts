import {
    Attribute,
    ChangedAttribute,
    CogHTMLElement,
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
import { isCustomElement } from "./isCustomElement";
import { changedAttributesToAttributes } from "../attributes/getAttributes";

function mergeAttributes(oldArray: Attribute[], newArray: Attribute[]) {
    const merged = oldArray.concat(newArray);
    const attributes: Record<string, Attribute> = {};
    for (let i = 0; i < merged.length; i++) {
        attributes[merged[i].name] = merged[i];
    }

    return Object.values(attributes);
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
        const changedAttributes = attributes?.slice() ?? [];

        if (changedAttributes.length) {
            const newAttributes =
                changedAttributesToAttributes(changedAttributes);
            const nodeIndex = reactiveNodes.index[originalNode.cogAnchorId];
            const reactiveNode = reactiveNodes.list[nodeIndex];

            reactiveNodes.update(
                nodeIndex,
                "attributes",
                mergeAttributes(reactiveNode.attributes, newAttributes)
            );
        }

        return;
    }

    if (content !== undefined) {
        if (originalNode.nodeType === Node.TEXT_NODE) {
            originalNode.textContent = content;
        } else {
            removeAllEventListeners(originalNode);

            originalNode.innerHTML = content;

            addAllEventListeners(originalNode, localState);
        }
    } else if (attributes !== undefined) {
        for (let i = 0; i < attributes.length; i++) {
            handleBooleanAttribute(originalNode, attributes[i]);
            originalNode.setAttribute(
                attributes[i].name,
                attributes[i].newValue as string
            );
        }
    } else if (addChildren.length) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < addChildren.length; i++) {
            fragment.appendChild(addChildren[i]);
        }
        originalNode.appendChild(fragment);
    } else if (removeChildren.length) {
        for (let i = 0; i < removeChildren.length; i++) {
            originalNode.removeChild(removeChildren[i]);
        }
    }
};

function getLocalState(
    parentId: number | null,
    attributes: Attribute[],
    globalState: State,
    reactiveNodes: ReactiveNode[]
) {
    if (parentId === null) {
        return attributesToState(attributes, globalState);
    }

    const parentNode = reactiveNodes.find((rn) => rn.id === parentId);

    const parentState: State = getLocalState(
        parentNode!.parentId,
        parentNode!.attributes,
        globalState,
        reactiveNodes
    );

    return Object.assign(
        {},
        parentState,
        attributesToState(attributes, parentState)
    );
}

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

const hasDependencies = (updatedStateKeys: string[], expression: string) => {
    const shouldUpdate = updatedStateKeys.some((key) => {
        const regex = new RegExp(
            `(\\s${key}\\s|{${key}\\s|\\s${key}}|{${key}}|(${key}))`,
            "gm"
        );
        return regex.test(expression);
    });

    return shouldUpdate;
};

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
            id,
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
            template + " " + attributesRecursive.map((a) => a.value).join(" ")
        );

        if (!stateUpdateAffects && !shouldUpdate) {
            continue;
        }

        if (shouldUpdate) {
            reactiveNodes.update(treeNodeIndex, "shouldUpdate", false);
        }

        let updatedContent = null;

        const localState = getLocalState(
            parentId,
            attributes,
            state,
            reactiveNodes.list
        );

        try {
            updatedContent = evaluateTemplate(
                template,
                expressions,
                localState
            );
        } catch (e) {
            console.error(e);
            continue;
        }

        const newElement = elementFromString(updatedContent);

        if (lastTemplateEvaluation === null) {
            reactiveNodes.update(
                treeNodeIndex,
                "lastTemplateEvaluation",
                updatedContent
            );
            reactiveNodes.update(treeNodeIndex, "element", newElement);
            newElement.cogAnchorId = id;
            element.parentNode?.replaceChild(newElement, element);
        } else {
            const oldElement = elementFromString(lastTemplateEvaluation);
            const changedNodes = compareNodes(oldElement, newElement);

            if (changedNodes.length > 0) {
                reactiveNodes.update(
                    treeNodeIndex,
                    "lastTemplateEvaluation",
                    updatedContent
                );

                for (let i = 0; i < changedNodes.length; i++) {
                    const originalNode = findCorrespondingNode(
                        changedNodes[i].node,
                        oldElement,
                        element
                    ) as CogHTMLElement;

                    const removeChildren = [];
                    let addChildren: HTMLElement[] = [];

                    if (changedNodes[i].toBeAdded !== undefined) {
                        addChildren = changedNodes[i].toBeAdded!;
                    }

                    if (changedNodes[i].toBeRemoved !== undefined) {
                        for (
                            let j = 0;
                            j < changedNodes[i].toBeRemoved!.length;
                            j++
                        ) {
                            const child = findCorrespondingNode(
                                changedNodes[i].toBeRemoved![j],
                                oldElement,
                                element
                            ) as HTMLElement;
                            if (child) {
                                removeChildren.push(child);
                            }
                        }
                    }

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
        }
    }

    reactiveNodes.clean(reactiveNodes.list);
};
