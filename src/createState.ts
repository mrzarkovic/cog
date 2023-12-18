import { ReactiveNodeId, StateKey, StateObject, TemplateName } from "./types";

export function createState(): StateObject {
    return {
        state: null,
        templates: null,
        updatedElements: [],
        elementsUpdatedKeys: {},
        get value() {
            if (!this.state) {
                this.state = {};
            }

            return this.state;
        },
        getTemplateState(template: TemplateName) {
            if (!this.templates) {
                this.templates = {};
            }

            return this.templates[template];
        },
        registerTemplateState(template: TemplateName, elementId: number) {
            if (this.templates && this.templates[template]) {
                this.templates[template].customElements[elementId] = {};

                for (let i = 0; i < this.templates[template].keys.length; i++) {
                    const stateKey = this.templates[template].keys[i];
                    let value =
                        this.templates[template].initial[stateKey].value;
                    const proxy =
                        this.templates[template].initial[stateKey].proxy;
                    if (proxy) {
                        value = proxy(stateKey, (value as unknown[]).slice(0));
                    }
                    this.templates[template].customElements[elementId][
                        stateKey
                    ] = {
                        value: value,
                        dependents: [],
                        computants: [],
                        dependencies: [],
                    };
                }
            }
        },
        initializeTemplateState(
            template: TemplateName,
            stateKey: StateKey,
            value: unknown,
            proxy
        ) {
            if (!this.templates) {
                this.templates = {};
            }
            if (!this.templates[template]) {
                this.templates[template] = {
                    keys: [],
                    initial: {},
                    customElements: {},
                };
            }

            this.templates[template].initial[stateKey] = { value, proxy };
            this.templates[template].keys.push(stateKey);
        },
        updateTemplateState(
            template: TemplateName,
            elementId: ReactiveNodeId,
            stateKey: StateKey,
            value: unknown
        ) {
            this.templates![template].customElements[elementId][
                stateKey
            ].value = value;

            this.templates![template].customElements[elementId][
                stateKey
            ].computants.forEach((computant) => {
                this._registerStateUpdate(elementId, computant);
            });

            this._registerStateUpdate(elementId, stateKey);
        },
        initializeGlobalState(stateKey: StateKey, value: unknown) {
            if (!this.state) {
                this.state = {};
            }

            if (!this.state[stateKey]) {
                this.state[stateKey] = {
                    value,
                    dependents: [],
                    computants: [],
                    dependencies: [],
                };
            } else {
                this.state[stateKey].value = value;
            }
        },
        updateGlobalState(stateKey: StateKey, value: unknown) {
            this.state![stateKey].value = value;

            this.value[stateKey].computants.forEach((computant) => {
                this._registerGlobalStateUpdate(computant);
            });

            this._registerGlobalStateUpdate(stateKey);
        },
        _registerGlobalStateUpdate(stateKey: StateKey) {
            const parts = stateKey.split(".");

            // If computant is a template state
            if (parts.length > 1) {
                const temp = parts[1].split(":");
                const stateKey = temp[0];
                const elementId = Number(temp[1]);
                this._registerStateUpdate(elementId, stateKey);
                return;
            }
            this.value[stateKey].dependents.forEach((dependent) => {
                this._registerStateUpdate(dependent, stateKey);
            });
        },

        _registerStateUpdate(elementId: ReactiveNodeId, stateKey: StateKey) {
            if (this.updatedElements.indexOf(elementId) === -1) {
                this.updatedElements.push(elementId);
                this.elementsUpdatedKeys[elementId] = [];
            }
            if (this.elementsUpdatedKeys[elementId].indexOf(stateKey) === -1) {
                this.elementsUpdatedKeys[elementId].push(stateKey);
            }
        },
        clearUpdates() {
            this.updatedElements = [];
            this.elementsUpdatedKeys = {};
        },
    };
}
