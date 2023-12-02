import { type Cog, type DocumentWithHandler } from "./types";
import { createRootElement } from "./rootElement";
import { loadCustomElements } from "./nodes/loadCustomElements";
import { addAllEventListeners } from "./eventListeners/addAllEventListeners";
import { loadNativeElements } from "./nodes/loadNativeElements";
import { reconcile } from "./nodes/reconcile";
import { createState } from "./state";
import { createCustomElements } from "./customElements";
import { createNativeElements } from "./nativeElements";

export const init = (document: Document): Cog => {
    const nativeElements = createNativeElements();
    const customElements = createCustomElements();
    const rootElement = createRootElement(document);
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
        loadNativeElements(rootElement.value, state.value, nativeElements);
        loadCustomElements(rootElement.value, state.value, customElements);
        addAllEventListeners(rootElement.value, state.value);
        // reRender();
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
