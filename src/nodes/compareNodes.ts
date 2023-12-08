import { ChangedNode } from "../types";
import { getChangedAttributes } from "../attributes/getChangedAttributes";

export function compareTextNodes(
    oldNode: HTMLElement,
    newNode: HTMLElement
): ChangedNode[] {
    if (oldNode.textContent !== newNode.textContent) {
        return [
            {
                node: oldNode,
                content: newNode.textContent ?? "",
            },
        ];
    }
    return [];
}

export function compareChildNodes(
    oldNode: HTMLElement,
    newNode: HTMLElement
): ChangedNode[] {
    const toBeRemoved: HTMLElement[] = [];
    const toBeAdded: HTMLElement[] = [];
    const nodesLength = Math.max(
        oldNode.childNodes.length,
        newNode.childNodes.length
    );
    let changedChildren: ChangedNode[] = [];

    for (let i = 0; i < nodesLength; i++) {
        const oldChild = oldNode.childNodes[i] as HTMLElement;
        const newChild = newNode.childNodes[i] as HTMLElement;

        if (
            oldChild?.nodeType === Node.TEXT_NODE &&
            newChild?.nodeType === Node.TEXT_NODE
        ) {
            if (oldChild.textContent?.trim() !== newChild.textContent?.trim()) {
                return [{ node: newNode, content: newNode.innerHTML }];
            }
        } else if (!oldChild) {
            toBeAdded.push(newChild);
        } else if (!newChild) {
            toBeRemoved.push(oldChild);
        } else {
            changedChildren = changedChildren.concat(
                compareNodes(oldChild, newChild)
            );
        }
    }

    if (toBeRemoved.length) {
        changedChildren.push({ node: newNode, toBeRemoved });
    }
    if (toBeAdded.length) {
        changedChildren.push({ node: newNode, toBeAdded });
    }

    return changedChildren;
}

export function compareNodes(
    oldNode: HTMLElement,
    newNode: HTMLElement
): ChangedNode[] {
    if (oldNode.nodeType === Node.TEXT_NODE) {
        return compareTextNodes(oldNode, newNode);
    }

    const changedAttributes = getChangedAttributes(oldNode, newNode);
    const changedChildren: ChangedNode[] =
        changedAttributes.length > 0
            ? [
                  {
                      node: newNode,
                      attributes: changedAttributes,
                  },
              ]
            : [];

    return changedChildren.concat(compareChildNodes(oldNode, newNode));
}
