import { ReactiveNodesStack, ReactiveNode } from "../types";

export function createNativeElements(): ReactiveNodesStack {
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
    };
}
