import { ReactiveNodeId, StateKey, StateObject, TemplateName } from "./types";

export function createState(): StateObject {
    return {
        state: null,
        templates: null,
        updatedElements: [],
        elementsUpdatedKeys: {},
        updatedCustomElements: [],
        customElementsUpdatedKeys: {},
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
                    this.templates[template].customElements[elementId][
                        this.templates[template].keys[i]
                    ] = {
                        value: this.templates[template].initial[
                            this.templates[template].keys[i]
                        ],
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
            value: unknown
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

            this.templates[template].initial[stateKey] = value;
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
                this._registerTemplateStateUpdate(elementId, computant);
            });

            this._registerTemplateStateUpdate(elementId, stateKey);
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
            this.value[stateKey].dependents.forEach((dependent) => {
                if (this.updatedElements.indexOf(dependent) === -1) {
                    this.updatedElements.push(dependent);
                    this.elementsUpdatedKeys[dependent] = [];
                }
                if (
                    this.elementsUpdatedKeys[dependent].indexOf(stateKey) === -1
                ) {
                    this.elementsUpdatedKeys[dependent].push(stateKey);
                }
            });
        },
        _registerTemplateStateUpdate(
            elementId: ReactiveNodeId,
            stateKey: StateKey
        ) {
            if (this.updatedCustomElements.indexOf(elementId) === -1) {
                this.updatedCustomElements.push(elementId);
                this.customElementsUpdatedKeys[elementId] = [];
            }
            if (
                this.customElementsUpdatedKeys[elementId].indexOf(stateKey) ===
                -1
            ) {
                this.customElementsUpdatedKeys[elementId].push(stateKey);
            }
        },
        clearUpdates() {
            this.updatedCustomElements = [];
            this.customElementsUpdatedKeys = {};
            this.updatedElements = [];
            this.elementsUpdatedKeys = {};
        },
    };
}
