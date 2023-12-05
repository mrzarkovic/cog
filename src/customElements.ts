import { ReactiveNodesList, ReactiveNode } from "./types";
import { cleanReactiveNodesList } from "./nodes/cleanReactiveNodesList";

export function createReactiveNodes(): ReactiveNodesList {
    return {
        list: [] as ReactiveNode[],
        get value() {
            return this.list;
        },
        add(item: ReactiveNode) {
            this.list.push(item);
        },
        update(index: number, property: keyof ReactiveNode, value: unknown) {
            this.list[index][property] = value as never;
        },
        clean(list: ReactiveNode[]) {
            this.list = cleanReactiveNodesList(list);
        },
    };
}
