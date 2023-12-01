import { type Cog, type DOMTree, type DocumentWithHandler } from "./types";
import { createAppElement } from "./util/appElement";
import { defineCustomElement } from "./util/defineCustomElement";
import { addAllEventListeners } from "./util/eventListeners/addAllEventListeners";
import { loadTemplates } from "./util/loadTemplates";
import { loadTree } from "./util/loadTree";
import { reconcile } from "./util/reconcile";
import { createState } from "./util/state";
import { templatesStack } from "./util/templatesStack";

export const init = (document: Document): Cog => {
    let tree: DOMTree = [];
    let templates: HTMLTemplateElement[] = [];
    const appElement = createAppElement(document);
    const state = createState();

    function reRender() {
        reconcile(tree, state.value);
        reconcile(templatesStack.value, state.value);
    }

    function updateState<T>(name: string, value: T) {
        setTimeout(() => {
            state.set(name, value);
            reRender();
        }, 0);
    }

    function defineCustomElements(templates: HTMLTemplateElement[]) {
        templates.forEach((template) => {
            const name = template.getAttribute("id");

            if (!name) {
                throw new Error("Missing id attribute");
            }

            if (template.content.childNodes.length !== 1) {
                throw new Error(`Template ${name} should have a single child`);
            }
            defineCustomElement(name, template, state);
        });
    }

    const onLoad = () => {
        templates = loadTemplates(appElement.value);
        tree = loadTree(appElement.value);
        defineCustomElements(templates);
        addAllEventListeners(appElement.value, state.value);
        reRender();
    };

    const onLoadHandler = (document as DocumentWithHandler)["onLoadHandler"];
    if (onLoadHandler) {
        document.removeEventListener("DOMContentLoaded", onLoadHandler);
    }
    document.addEventListener("DOMContentLoaded", onLoad);
    (document as DocumentWithHandler)["onLoadHandler"] = onLoad;

    return {
        variable: <T>(name: string, value: T) => {
            state.set(name, value);

            return {
                set value(newVal: T) {
                    updateState(name, newVal);
                },
                get value() {
                    return state.value[name] as T;
                },
                set: (newVal: T) => {
                    updateState(name, newVal);
                },
            };
        },
    };
};

export const { variable } = init(document);
