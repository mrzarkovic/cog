interface Cog {
    variable: <T>(name: string, value: T) => {
        set value(newVal: T);
        get value(): T;
        set: (newVal: T) => void;
    };
}
type HTMLString = string;
type Attribute = {
    name: string;
    value: string;
    reactive: boolean;
};
type ReactiveNode = {
    element: HTMLElement;
    template: HTMLString;
    attributes: Attribute[];
    parentAttributes: Attribute[];
};
type ReactiveTemplateNode = {
    element: HTMLElementFromTemplate;
    template: HTMLString;
    attributes: Attribute[];
    parentAttributes: Attribute[];
};
type DOMTree = ReactiveNode[];
type State = Record<string, unknown>;
type HTMLElementFromTemplate = HTMLElement & {
    lastTemplateEvaluation: string;
};
export declare function evaluateExpression(expression: string, state: State): string;
export declare function findNextTemplateExpression(htmlText: string): {
    start: number;
    end: number;
};
export declare const render: (tree: DOMTree, state: State) => void;
export declare const renderTemplates: (tree: ReactiveTemplateNode[], state: State) => void;
export declare const loadTree: (rootElement: Node, parentAttributes: Attribute[]) => DOMTree;
export declare const loadTemplates: (rootElement: Node) => HTMLTemplateElement[];
export declare function addEventListeners(parent: HTMLElement, eventName: string | undefined, state: State): void;
export declare function removeEventListeners(parent?: HTMLElement, eventName?: string): void;
export declare const init: (document: Document) => Cog;
export declare const variable: <T>(name: string, value: T) => {
    value: T;
    set: (newVal: T) => void;
};
export {};
