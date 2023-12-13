import { StateObject } from "./types";

export function createState(): StateObject {
    return {
        state: null,
        updatedKeys: [],
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

            if (!this.state[key]) {
                this.state[key] = {
                    value,
                    dependents: [],
                    computants: [],
                };
            } else {
                this.state[key].value = value;
            }
        },
        registerUpdate(key: string) {
            this.updatedKeys.push(key);
        },
        clearUpdates() {
            this.updatedKeys = [];
        },
    };
}
