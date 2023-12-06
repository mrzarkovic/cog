import { evaluateTemplate } from "../html/evaluateTemplate";
import { Attribute, State } from "../types";
import { convertAttribute } from "./convertAttribute";
import { convertAttributeValue } from "./convertAttributeValue";

const attributesToStates: Record<string, State> = {};

export function attributesToState(attributes: Attribute[], state: State) {
    const key = JSON.stringify(attributes) + JSON.stringify(state);

    if (!attributesToStates[key]) {
        const localState: State = Object.assign({}, state);

        for (let i = 0; i < attributes.length; i++) {
            localState[convertAttribute(attributes[i].name)] =
                convertAttributeValue(
                    attributes[i].reactive
                        ? evaluateTemplate(
                              attributes[i].value,
                              attributes[i].expressions,
                              state
                          )
                        : attributes[i].value
                );
        }

        attributesToStates[key] = localState;
    }

    return attributesToStates[key];
}
