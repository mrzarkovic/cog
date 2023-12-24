import {
    ReactiveNodesList,
    ReactiveNode,
    ReactiveNodeIndex,
    CogHTMLElement,
    Attribute,
    ReactiveNodeId,
    HTMLString,
    Expression,
    TemplateName,
} from "./types";

export function createReactiveNodes(): ReactiveNodesList {
    return {
        lastId: 0,
        list: [] as ReactiveNode[],
        index: {} as ReactiveNodeIndex,
        get value() {
            return this.list;
        },
        get(id: number) {
            return this.list[this.index[id]];
        },
        add(item: ReactiveNode) {
            this.list.push(item);
            this.index[item.id] = this.list.length - 1;
        },
        update(id: number, property: keyof ReactiveNode, value: unknown) {
            this.list[this.index[id]][property] = value as never;
        },
        remove(id: number) {
            const index = this.index[id];
            this.list.splice(index, 1);
            this.index = this.list.reduce((index, item, i) => {
                index[item.id] = i;
                return index;
            }, {} as ReactiveNodeIndex);
        },

        id() {
            return this.lastId++;
        },
        new(
            id: ReactiveNodeId,
            parentId: ReactiveNodeId | null,
            attributes: Attribute[],
            templateName: TemplateName | null,
            expressions: Expression[] = [],
            template: HTMLString = "",
            element: HTMLElement | null = null,
            lastTemplateEvaluation: CogHTMLElement | null = null,
            shouldUpdate: boolean = false,
            newAttributes: string[] = []
        ) {
            return {
                id,
                parentId,
                element,
                template,
                lastTemplateEvaluation,
                attributes,
                expressions,
                templateName,
                shouldUpdate,
                newAttributes,
            };
        },
    };
}
