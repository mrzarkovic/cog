import { type Cog } from "./types";
import { registerTemplates } from "./nodes/registerTemplates";
import { addAllEventListeners } from "./eventListeners/addAllEventListeners";
import { registerNativeElements } from "./nodes/registerNativeElements";
import { reconcile } from "./nodes/reconcile";
import { createState } from "./createState";
import { createReactiveNodes } from "./createReactiveNodes";

export const init = (): Cog => {
    let calling: string | null = null;
    const reactiveNodes = createReactiveNodes();
    let updateStateTimeout: number | null = null;
    const state = createState();

    function reRender() {
        reconcile(reactiveNodes, state.value, state.updatedKeys);
        reactiveNodes.clean();
        state.clearUpdates();
    }

    let lastFrameTime = 0;
    const frameDelay = 1000 / 60;

    function updateState<T>(name: string, value: T) {
        state.set(name, value);
        if (updateStateTimeout !== null) {
            cancelAnimationFrame(updateStateTimeout);
        }
        updateStateTimeout = requestAnimationFrame((currentTime) => {
            if (currentTime - lastFrameTime > frameDelay) {
                lastFrameTime = currentTime;
                reRender();
            }
        });
    }

    const render = (rootElement: HTMLElement) => {
        registerNativeElements(rootElement, state.value, reactiveNodes);
        registerTemplates(rootElement, state.value, reactiveNodes);
        addAllEventListeners(rootElement, state.value);
    };

    return {
        render,
        variable: <T>(name: string, value: T) => {
            if (value instanceof Function) {
                console.log("function", name);
                state.set(name, (...args: unknown[]) => {
                    console.log("called", name, args);
                    calling = name;
                    return value(...args);
                });
            } else {
                state.set(name, value);
            }

            return {
                set value(newVal: T) {
                    updateState(name, newVal);
                },
                get value() {
                    console.log(calling, "is getting value");
                    return state.value[name] as T;
                },
                set: (newVal: T) => {
                    updateState(name, newVal);
                },
            };
        },
    };
};

export const { variable, render } = init();
