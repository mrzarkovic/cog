import { ReactiveNode } from "../types";
import { cleanTemplatesTree } from "./helpers/cleanTemplatesTree";

export const templatesStack = {
    stack: [] as ReactiveNode[],
    get value() {
        return this.stack;
    },
    add(item: ReactiveNode) {
        this.stack.push(item);
    },
    clean() {
        this.stack = cleanTemplatesTree(this.stack);
    },
};
