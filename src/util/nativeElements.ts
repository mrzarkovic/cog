import { ReactiveNodesList, ReactiveNode } from "../types";

export function createNativeElements(): ReactiveNodesList {
    return {
        list: [] as ReactiveNode[],
        get value() {
            return this.list;
        },
        add(item: ReactiveNode) {
            this.list.push(item);
        },
        updateLastTemplateEvaluation(index: number, value: string) {
            this.list[index].lastTemplateEvaluation = value;
        },
    };
}
