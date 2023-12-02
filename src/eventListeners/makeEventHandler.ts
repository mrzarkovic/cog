import { State } from "../types";
import { createExpressionScope } from "../expressions/createExpressionScope";

export const makeEventHandler = (
    eventName: string,
    element: Element,
    state: State
) => {
    const handler = element.getAttribute(`data-on-${eventName}`);
    if (!handler) {
        throw new Error("Missing data-handler attribute");
    }

    const handlerWithScope = createExpressionScope(handler, state);

    return function (e: Event) {
        try {
            handlerWithScope(state);
            e.preventDefault();
        } catch (e: unknown) {
            throw new Error(
                `${(e as Error).message}: data-on-${eventName}=${handler}`
            );
        }
    };
};
