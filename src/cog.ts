import { type Cog, UnknownFunction, StateValue } from "./types";
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

        let updatedKeys = state.updatedKeys;

        state.updatedCustomElements.forEach((id) => {
            uniqueKeys[id] = true;
            updatedKeys = [
                ...updatedKeys,
                ...state.customElementsUpdatedKeys[id],
            ];
        });
        const uniqueDependents = Object.keys(uniqueKeys);

        const nodesToReconcile = uniqueDependents.map((id) =>
            reactiveNodes.get(Number(id))
        );

        reconcile(reactiveNodes, nodesToReconcile, state, updatedKeys);
        reactiveNodes.clean();
        state.clearUpdates();
    }

    let lastFrameTime = 0;
    const frameDelay = 1000 / 60;

    function scheduleReRender() {
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
        addAllEventListeners(rootElement, state.value);
        registerNativeElements(rootElement, state.value, reactiveNodes);
        registerTemplates(rootElement, state, reactiveNodes);
    };

    const getFunctionValue =
        (name: string, value: UnknownFunction) =>
        (cogId: unknown, ...args: unknown[]) => {
            if (typeof cogId === "string") {
                if (cogId.indexOf("cogId:") === 0) {
                    cogId = cogId.replace("cogId:", "");
                } else {
                    args.unshift(cogId);
                    cogId = null;
                }
            }
            stateFunctionExecuting = cogId ? `${name}:${cogId}` : name;
            const result = value(...args);
            stateFunctionExecuting = null;
            return result;
        };

    const registerStateUpdate = (stateKey: string) => {
        state.value[stateKey].computants.forEach((computant) => {
            state.registerUpdate(computant);
        });
        state.registerUpdate(stateKey);
        scheduleReRender();
    };

    const getArrayValue = (name: string, value: unknown[]) =>
        new Proxy(value, {
            get(target, propKey) {
                const originalMethod = target[
                    propKey as keyof typeof target
                ] as UnknownFunction;
                if (propKey === "push") {
                    return (...args: unknown[]) => {
                        registerStateUpdate(name);
                        return originalMethod.apply(target, args);
                    };
                }
                return originalMethod;
            },
        });

    const variable = <T>(name: string, value: T, template?: string) => {
        let fullStateName = name;
        if (template) {
            fullStateName = `${template}.${name}`;
        }

        if (value instanceof Function) {
            value = getFunctionValue(
                fullStateName,
                value as UnknownFunction
            ) as T;
        } else if (Array.isArray(value)) {
            value = getArrayValue(fullStateName, value) as T;
        }

        if (template) {
            state.setTemplate(template, name, value);
        } else {
            state.set(name, value);
        }

        return {
            get value() {
                if (template) {
                    const cogId = stateFunctionExecuting?.split(":")[1];
                    if (!cogId) {
                        throw new Error("Can't call outside of a template");
                    }

                    const value =
                        state.getTemplateState(template).customElements[
                            Number(cogId)
                        ][name].value;

                    return value as T;
                }

                if (
                    stateFunctionExecuting !== null &&
                    (state.value[name] as StateValue).computants.indexOf(
                        stateFunctionExecuting
                    ) === -1
                ) {
                    (state.value[name] as StateValue).computants.push(
                        stateFunctionExecuting
                    );
                }

                return state.value[name].value as T;
            },
            set value(newVal: T) {
                if (template) {
                    const cogId = stateFunctionExecuting?.split(":")[1];
                    if (!cogId) {
                        throw new Error("Can't call outside of a template");
                    }

                    state.updateTemplateState(
                        template,
                        Number(cogId),
                        name,
                        newVal
                    );
                    scheduleReRender();
                } else {
                    state.set(name, newVal);
                    registerStateUpdate(name);
                }
            },
            set: (newVal: T) => {
                if (template) {
                    return;
                }
                state.set(name, newVal);
                registerStateUpdate(name);
            },
        };
    };

    return {
        render,
        variable,
    };
};

export const { variable, render } = init();
