// TODO: rename, not a tree

import { ReactiveNode } from "../../types";

export const cleanTemplatesTree = (
    templatesTree: ReactiveNode[]
): ReactiveNode[] => {
    return templatesTree.filter(({ element }) => {
        return document.body.contains(element);
    });
};
