import { evaluateTemplate } from "../html/evaluateTemplate";
import { Attribute, State } from "../types";
import { convertAttributeName } from "./convertAttributeName";
import { convertAttributeValue } from "./convertAttributeValue";

const attributesToStates: Record<string, State> = {};

export function attributesToState(attributes: Attribute[], state: State) {
    const key = JSON.stringify(attributes) + JSON.stringify(state);

    if (!attributesToStates[key]) {
        const localState: State = Object.assign({}, state);

        for (let i = 0; i < attributes.length; i++) {
            localState[convertAttributeName(attributes[i].name)] = {
                value: convertAttributeValue(
                    evaluateTemplate(
                        attributes[i].value,
                        attributes[i].expressions,
                        state
                    )
                ),
                dependents: [],
                computants: [],
            };
        }

        attributesToStates[key] = localState;
    }

    return attributesToStates[key];
}
