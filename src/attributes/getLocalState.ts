import { Attribute, ReactiveNode, State } from "../types";
import { attributesToState } from "./attributesToState";

export function getLocalState(
    parentId: number | null,
    attributes: Attribute[],
    globalState: State,
    reactiveNodes: ReactiveNode[],
    stateChanges: string[] = []
) {
    const parentNode = reactiveNodes.find((rn) => rn.id === parentId);

    if (!parentNode) {
        return attributesToState(attributes, globalState, stateChanges);
    }

    const parentState: State = getLocalState(
        parentNode!.parentId,
        parentNode!.attributes,
        globalState,
        reactiveNodes,
        stateChanges
    );

    return Object.assign(
        {},
        parentState,
        attributesToState(attributes, parentState, stateChanges)
    );
}
