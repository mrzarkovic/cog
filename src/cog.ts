import { type Cog } from "./types";
import { createRootElement } from "./rootElement";
import { loadTemplates } from "./nodes/loadCustomElements";
import { addAllEventListeners } from "./eventListeners/addAllEventListeners";
import { registerNativeElements } from "./nodes/loadNativeElements";
import { reconcile } from "./nodes/reconcile";
import { createState } from "./state";
import { createReactiveNodes } from "./customElements";

export const init = (document: Document): Cog => {
    const reactiveNodes = createReactiveNodes();
    const rootElement = createRootElement(document);
    let updateStateTimeout: number | null = null;
    const state = createState();

    function reRender() {
        reconcile(reactiveNodes, state.value);
    }

    function updateState<T>(name: string, value: T) {
        state.set(name, value);
        if (updateStateTimeout !== null) {
            clearTimeout(updateStateTimeout);
        }
        updateStateTimeout = setTimeout(() => {
            console.log("rerendering");
            reRender();
        }, 0);
    }

    const onLoad = () => {
        loadTemplates(rootElement.value, reactiveNodes);
        registerNativeElements(rootElement.value, reactiveNodes);
        addAllEventListeners(rootElement.value, state.value);
    };

    onLoad();

    // const onLoadHandler = (document as DocumentWithHandler)["onLoadHandler"];
    // if (onLoadHandler) {
    //     document.removeEventListener("DOMContentLoaded", onLoadHandler);
    // }
    // document.addEventListener("DOMContentLoaded", onLoad);
    // (document as DocumentWithHandler)["onLoadHandler"] = onLoad;

    return {
        variable: <T>(name: string, value: T) => {
            // updateState(name, value);
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
