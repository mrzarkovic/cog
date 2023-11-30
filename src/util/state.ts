import { StateObject } from "../types";

export const state: StateObject = {
    state: null,
    get value() {
        if (!this.state) {
            this.state = {};
        }

        return this.state;
    },
    set(key: string, value: unknown) {
        if (!this.state) {
            this.state = {};
        }

        this.state[key] = value;
    },
};
