import { ReactiveNode } from "../../types";

export const cleanReactiveNodesList = (
    reactiveNodes: ReactiveNode[]
): ReactiveNode[] => {
    return reactiveNodes.filter(({ element }) => {
        return document.body.contains(element);
    });
};
