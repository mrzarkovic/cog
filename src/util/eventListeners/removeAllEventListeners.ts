import { removeEventListeners } from "./removeEventListeners";

export function removeAllEventListeners(parent: HTMLElement) {
    removeEventListeners(parent, "click");
    removeEventListeners(parent, "change");
}
