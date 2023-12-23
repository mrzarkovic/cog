import { evaluateTemplate } from "../html/evaluateTemplate";
import { Attribute, State, StateKey } from "../types";
import { convertAttributeName } from "./convertAttributeName";
import { convertAttributeValue } from "./convertAttributeValue";

export function attributesToState(
    attributes: Attribute[],
    state: State,
    stateChanges: string[] = []
) {
    const localState: State = Object.assign({}, state);

    for (let i = 0; i < attributes.length; i++) {
        const attributeName = convertAttributeName(attributes[i].name);

        let value = attributes[i].value;
        let parentStateDependencies: StateKey[] = [];
        if (attributes[i].reactive) {
            parentStateDependencies = Array.from(
                new Set(
                    attributes[i].expressions
                        .map((expression) => expression.dependencies)
                        .flat()
                )
            );

            value = evaluateTemplate(
                attributes[i].value,
                attributes[i].expressions,
                state,
                stateChanges
            );
        }

        localState[attributeName] = {
            value: convertAttributeValue(value),
            dependents: [],
            computants: [],
            dependencies: parentStateDependencies,
        };
    }
    return localState;
}
