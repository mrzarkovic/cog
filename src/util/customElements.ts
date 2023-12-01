import { CustomElementsList, ReactiveNode } from "../types";
import { cleanReactiveNodesList } from "./helpers/cleanReactiveNodesList";

export function createCustomElements(): CustomElementsList {
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
        clean() {
            this.list = cleanReactiveNodesList(this.list);
        },
    };
}
