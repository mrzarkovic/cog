import { CustomElementsStack, ReactiveNode } from "../types";
import { cleanTemplatesTree } from "./helpers/cleanTemplatesTree";

export function createCustomElements(): CustomElementsStack {
    return {
        stack: [] as ReactiveNode[],
        get value() {
            return this.stack;
        },
        add(item: ReactiveNode) {
            this.stack.push(item);
        },
        updateLastTemplateEvaluation(index: number, value: string) {
            this.stack[index].lastTemplateEvaluation = value;
        },
        clean() {
            this.stack = cleanTemplatesTree(this.stack);
        },
    };
}
