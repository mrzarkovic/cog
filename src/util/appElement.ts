import { RootElement } from "../types";

export function createAppElement(document: Document): RootElement {
    return {
        element: null as HTMLElement | null,
        get value() {
            if (!this.element) {
                this.element = document.querySelector("#app");
            }
            if (!this.element) {
                throw new Error("No app element found!");
            }
            return this.element;
        },
    };
}
