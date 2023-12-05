import { ReactiveNode } from "../types";

export const cleanReactiveNodesList = (
    reactiveNodes: ReactiveNode[]
): ReactiveNode[] => {
    return reactiveNodes.filter(({ element }) => {
        const contains = document.body.contains(element);
        return contains;
    });
};
