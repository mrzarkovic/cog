interface Cog {
    variable: <T>(name: string, value: T) => {
        set: (newVal: T) => void;
        value: T;
    };
}
type HTMLString = string;
type ReactiveNode = {
    element: HTMLElement;
    template: HTMLString;
};
type DOMTree = ReactiveNode[];
type State = Record<string, unknown>;
export declare function evaluateExpression(expression: string, state: State): string;
export declare function findNextTemplateExpression(htmlText: string): {
    start: number;
    end: number;
};
export declare const render: (tree: DOMTree, state: State) => void;
export declare const loadTree: (rootElement: Node) => DOMTree;
export declare function addEventListeners(parent: HTMLElement, eventName: string | undefined, state: State): void;
export declare function removeEventListeners(parent?: HTMLElement, eventName?: string): void;
export declare const init: (document: Document) => Cog;
export declare const variable: <T>(name: string, value: T) => {
    set: (newVal: T) => void;
    value: T;
};
export {};
