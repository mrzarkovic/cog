import { ChangedElement } from "../../types";
import { getChangedAttributes } from "./getChangedAttributes";
import { sanitizeHtml } from "./sanitizeHtml";

// TODO: changed custom element like <my-element></my-element> will
// be returned twice if both attributes and content changed.
// But either way the entire element will be updated, so it's suboptimal
// because the loop with changed elements will be longer for no reason.

function compareTextNodes(
    oldNode: HTMLElement,
    newNode: HTMLElement
): ChangedElement[] {
    if (oldNode.textContent !== newNode.textContent) {
        return [
            {
                element: oldNode,
                newElement: newNode,
                content: newNode.textContent ?? "",
            },
        ];
    }
    return [];
}

function compareChildNodes(
    oldNode: HTMLElement,
    newNode: HTMLElement
): ChangedElement[] {
    let changedChildren: ChangedElement[] = [];

    for (let i = 0; i < oldNode.childNodes.length; i++) {
        const oldChild = oldNode.childNodes[i];
        const newChild = newNode.childNodes[i];

        if (
            oldChild.nodeType === Node.TEXT_NODE &&
            newChild?.nodeType === Node.TEXT_NODE
        ) {
            if (oldChild.textContent !== newChild.textContent) {
                changedChildren.push({
                    element: oldNode,
                    newElement: newNode,
                    content: newNode.innerHTML,
                });
                break;
            }
        } else {
            const changes = compareNodes(
                oldChild as HTMLElement,
                newChild as HTMLElement
            );
            changedChildren = changedChildren.concat(changes);
        }
    }

    return changedChildren;
}

export function compareNodes(
    oldNode: HTMLElement,
    newNode: HTMLElement
): ChangedElement[] {
    if (oldNode.nodeType === Node.TEXT_NODE) {
        return compareTextNodes(oldNode, newNode);
    }

    oldNode.innerHTML = sanitizeHtml(oldNode.innerHTML);
    newNode.innerHTML = sanitizeHtml(newNode.innerHTML);

    const changedAttributes = getChangedAttributes(oldNode, newNode);
    const changedChildren: ChangedElement[] =
        changedAttributes.length > 0
            ? [
                  {
                      element: oldNode,
                      newElement: newNode,
                      attributes: changedAttributes,
                  },
              ]
            : [];

    return changedChildren.concat(compareChildNodes(oldNode, newNode));
}
