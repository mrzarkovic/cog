import { ReactiveNodesList, ReactiveNode, ReactiveNodeIndex } from "./types";
import { cleanReactiveNodesList } from "./nodes/cleanReactiveNodesList";

export function createReactiveNodes(): ReactiveNodesList {
    return {
        lastId: 0,
        list: [] as ReactiveNode[],
        index: {} as ReactiveNodeIndex,
        get value() {
            return this.list;
        },
        add(item: ReactiveNode) {
            this.list.push(item);
            this.index[item.id] = this.list.length - 1;
        },
        update(index: number, property: keyof ReactiveNode, value: unknown) {
            if (property === "attributes") {
                this.list[index].shouldUpdate = true;
            }
            this.list[index][property] = value as never;
        },
        clean() {
            this.list = cleanReactiveNodesList(this.list);
            this.index = this.list.reduce((index, item, i) => {
                index[item.id] = i;
                return index;
            }, {} as ReactiveNodeIndex);
        },
        id() {
            return this.lastId++;
        },
    };
}
