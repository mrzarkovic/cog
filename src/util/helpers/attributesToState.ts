import { Attribute, State } from "../../types";
import { convertAttribute } from "./convertAttribute";
import { evaluateExpression } from "./evaluateExpression";

export function attributesToState(attributes: Attribute[], state: State) {
    const localState: State = Object.assign({}, state);

    for (let i = 0; i < attributes.length; i++) {
        localState[convertAttribute(attributes[i].name)] = attributes[i]
            .reactive
            ? evaluateExpression(attributes[i].value, state)
            : attributes[i].value;
    }

    return localState;
}
