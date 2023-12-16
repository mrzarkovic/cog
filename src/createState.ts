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
                    dependencies: [],
                };
            } else {
                this.state[key].value = value;
            }
        },
        registerUpdate(key: string) {
            if (this.updatedKeys.indexOf(key) === -1) {
                this.updatedKeys.push(key);
            }
        },
        clearUpdates() {
            this.updatedKeys = [];
        },
    };
}
