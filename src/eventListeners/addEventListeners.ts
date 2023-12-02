import { ElementWithHandler, State } from "../types";
import { makeEventHandler } from "./makeEventHandler";

export function addEventListeners(
    parent: HTMLElement,
    eventName: string,
    state: State
) {
    parent.querySelectorAll(`[data-on-${eventName}]`).forEach((element) => {
        const handler = makeEventHandler(eventName, element, state);
        element.addEventListener(eventName, handler);
        (element as ElementWithHandler)[`${eventName}Handler`] = handler;
    });
}
