export const appElement = {
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
