import { ChangedElement } from "../../types";
import { getChangedAttributes } from "./getChangedAttributes";
import { sanitizeHtml } from "./sanitizeHtml";

export function compareNodes(
    oldNode: HTMLElement,
    newNode: HTMLElement
): ChangedElement[] {
    // TODO: changed custom element like <my-element></my-element> will
    // be returned twice if both attributes and content changed.
    // But either way the entire element will be updated, so it's suboptimal
    // because the loop with changed elements will be longer for no reason.

    if (oldNode.nodeType === Node.TEXT_NODE) {
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
    } else {
        oldNode.innerHTML = sanitizeHtml(oldNode.innerHTML);
        newNode.innerHTML = sanitizeHtml(newNode.innerHTML);

        let textContentChanged = false;
        let changedChildren: ChangedElement[] = [];

        for (let i = 0; i < oldNode.childNodes.length; i++) {
            const oldChild = oldNode.childNodes[i];
            const newChild = newNode.childNodes[i];
            if (
                oldChild.nodeType === Node.TEXT_NODE &&
                newChild &&
                newChild.nodeType === Node.TEXT_NODE
            ) {
                if (oldChild.textContent !== newChild.textContent) {
                    textContentChanged = true;
                    break;
                }
            } else if (oldChild.nodeType === Node.ELEMENT_NODE) {
                const changedAttributes = getChangedAttributes(
                    oldChild as HTMLElement,
                    newChild as HTMLElement
                );
                if (changedAttributes.length > 0) {
                    changedChildren.push({
                        element: oldChild as HTMLElement,
                        newElement: newChild as HTMLElement,
                        attributes: changedAttributes,
                    });
                }
            }
        }

        if (textContentChanged) {
            return [
                {
                    element: oldNode,
                    newElement: newNode,
                    content: newNode.innerHTML,
                },
            ];
        } else {
            for (let i = 0; i < oldNode.childNodes.length; i++) {
                const changes = compareNodes(
                    oldNode.childNodes[i] as HTMLElement,
                    newNode.childNodes[i] as HTMLElement
                );
                changedChildren = changedChildren.concat(changes);
            }

            return changedChildren;
        }
    }
}
