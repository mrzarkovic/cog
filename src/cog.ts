import { type Cog, UnknownFunction } from "./types";
import { registerTemplates } from "./nodes/registerTemplates";
import { addAllEventListeners } from "./eventListeners/addAllEventListeners";
import { registerNativeElements } from "./nodes/registerNativeElements";
import { reconcile } from "./nodes/reconcile";
import { createState } from "./createState";
import { createReactiveNodes } from "./createReactiveNodes";

export const init = (): Cog => {
    let stateFunctionExecuting: string | null = null;
    const reactiveNodes = createReactiveNodes();
    let updateStateTimeout: number | null = null;
    const state = createState();

    function reRender() {
        const uniqueKeys: Record<number, boolean> = {};
        state.updatedKeys
            .map((stateKey) => state.value[stateKey].dependents)
            .flat()
            .forEach((id) => (uniqueKeys[id] = true));
        const uniqueDependents = Object.keys(uniqueKeys);

        const nodesToReconcile = uniqueDependents.map((id) =>
            reactiveNodes.get(Number(id))
        );

        reconcile(reactiveNodes, nodesToReconcile, state.value);
        reactiveNodes.clean();
        state.clearUpdates();
    }

    let lastFrameTime = 0;
    const frameDelay = 1000 / 60;

    function scheduleReRender(stateKey: string) {
        state.value[stateKey].computants.forEach((computant) => {
            state.registerUpdate(computant);
        });
        state.registerUpdate(stateKey);
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

    const setFunctionValue = (name: string, value: UnknownFunction) => {
        state.set(name, (...args: unknown[]) => {
            stateFunctionExecuting = name;
            const result = value(...args);
            stateFunctionExecuting = null;
            return result;
        });
    };

    const setArrayValue = (name: string, value: unknown[]) => {
        const valueProxy = new Proxy(value, {
            get(target, propKey) {
                const originalMethod = target[
                    propKey as keyof typeof target
                ] as UnknownFunction;
                if (propKey === "push") {
                    return (...args: unknown[]) => {
                        scheduleReRender(name);
                        return originalMethod.apply(target, args);
                    };
                }
                return originalMethod;
            },
        });
        state.set(name, valueProxy);
    };

    const variable = <T>(name: string, value: T) => {
        if (value instanceof Function) {
            setFunctionValue(name, value as UnknownFunction);
        } else if (Array.isArray(value)) {
            setArrayValue(name, value);
        } else {
            state.set(name, value);
        }

        return {
            get value() {
                if (
                    stateFunctionExecuting !== null &&
                    state.value[name].computants.indexOf(
                        stateFunctionExecuting
                    ) === -1
                ) {
                    state.value[name].computants.push(stateFunctionExecuting);
                }

                return state.value[name].value as T;
            },
            set value(newVal: T) {
                state.set(name, newVal);
                scheduleReRender(name);
            },
            set: (newVal: T) => {
                state.set(name, newVal);
                scheduleReRender(name);
            },
        };
    };

    return {
        render,
        variable,
    };
};

export const { variable, render } = init();
