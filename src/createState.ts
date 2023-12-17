import { StateKey, StateObject, TemplateName } from "./types";

export function createState(): StateObject {
    return {
        state: null,
        templates: null,
        updatedKeys: [],
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
            if (!this.templates) {
                throw new Error("No templates state found");
            }
            if (!this.templates[template]) {
                throw new Error(`No state found for ${template}`);
            }

            this.templates[template].customElements[elementId] = {};

            for (let i = 0; i < this.templates[template].keys.length; i++) {
                this.templates[template].customElements[elementId][
                    this.templates[template].keys[i]
                ] = {
                    value: this.templates[template].initial[
                        this.templates[template].keys[i]
                    ].value,
                    dependents: [],
                    computants: [],
                    dependencies: [],
                };
            }
        },
        setTemplate(
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

            this.templates[template].initial[stateKey] = {
                value,
                dependents: [],
                computants: [],
                dependencies: [],
            };
            this.templates[template].keys.push(stateKey);
        },
        updateTemplateState(
            template: TemplateName,
            elementId: number,
            stateKey: StateKey,
            value: unknown
        ) {
            this.templates![template].customElements[elementId][
                stateKey
            ].value = value;
            if (this.updatedCustomElements.indexOf(elementId) === -1) {
                this.updatedCustomElements.push(elementId);
                this.customElementsUpdatedKeys[elementId] = [];
            }
            this.customElementsUpdatedKeys[elementId].push(stateKey);
        },
        set(stateKey: StateKey, value: unknown) {
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
        registerUpdate(stateKey: string) {
            if (this.updatedKeys.indexOf(stateKey) === -1) {
                this.updatedKeys.push(stateKey);
            }
        },
        clearUpdates() {
            this.updatedKeys = [];
            this.updatedCustomElements = [];
            this.customElementsUpdatedKeys = {};
        },
    };
}
