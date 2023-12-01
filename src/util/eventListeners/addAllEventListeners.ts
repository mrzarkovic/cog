import { State } from "../../types";
import { addEventListeners } from "./addEventListeners";

export function addAllEventListeners(parent: HTMLElement, state: State) {
    addEventListeners(parent, "click", state);
    addEventListeners(parent, "change", state);
}
