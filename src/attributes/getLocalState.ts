import { Attribute, ReactiveNode, State } from "../types";
import { attributesToState } from "./attributesToState";

export function getLocalState(
    parentId: number | null,
    attributes: Attribute[],
    globalState: State,
    reactiveNodes: ReactiveNode[]
) {
    const parentNode = reactiveNodes.find((rn) => rn.id === parentId);

    if (!parentNode) {
        return attributesToState(attributes, globalState);
    }

    const parentState: State = getLocalState(
        parentNode!.parentId,
        parentNode!.attributes,
        globalState,
        reactiveNodes
    );

    return Object.assign(
        {},
        parentState,
        attributesToState(attributes, parentState)
    );
}
