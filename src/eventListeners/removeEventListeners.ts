import { ElementWithHandler } from "../types";

export function removeEventListeners(parent: HTMLElement, eventName: string) {
    parent.querySelectorAll(`[data-on-${eventName}]`).forEach((element) => {
        const handler = (element as ElementWithHandler)[`${eventName}Handler`];
        if (handler) {
            element.removeEventListener(eventName, handler);
        }
    });
}
