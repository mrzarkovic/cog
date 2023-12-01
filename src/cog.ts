import { type Cog, type DocumentWithHandler } from "./types";
import { createAppElement } from "./util/appElement";
import { defineCustomElements } from "./util/defineCustomElements";
import { addAllEventListeners } from "./util/eventListeners/addAllEventListeners";
import { loadNativeElements } from "./util/loadNativeElements";
import { reconcile } from "./util/reconcile";
import { createState } from "./util/state";
import { createCustomElements } from "./util/customElements";
import { createNativeElements } from "./util/nativeElements";

export const init = (document: Document): Cog => {
    const nativeElements = createNativeElements();
    const customElements = createCustomElements();
    const appElement = createAppElement(document);
    const state = createState();

    function reRender() {
        reconcile(nativeElements, state.value);
        reconcile(customElements, state.value);
    }

    function updateState<T>(name: string, value: T) {
        setTimeout(() => {
            state.set(name, value);
            reRender();
        }, 0);
    }

    const onLoad = () => {
        defineCustomElements(appElement.value, state.value, customElements);
        loadNativeElements(appElement.value, nativeElements);
        console.log(nativeElements.value);
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
