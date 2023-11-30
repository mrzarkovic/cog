export interface Cog {
    variable: <T>(name: string, value: T) => {
        set value(newVal: T);
        get value(): T;
        set: (newVal: T) => void;
    };
}
export type HTMLString = string;
export type Attribute = {
    name: string;
    value: string;
    reactive: boolean;
};
export type ReactiveNode = {
    element: HTMLElementFromTemplate;
    template: HTMLString;
    attributes: Attribute[];
    parentAttributes: Attribute[];
};
export type DOMTree = ReactiveNode[];
export type ChangedElement = {
    element: HTMLElement;
    newElement: HTMLElement;
    content?: HTMLString;
    attributes?: {
        name: string;
        newValue: string;
    }[];
};
export type State = Record<string, unknown>;
export type ElementWithHandler = Element & {
    [key: string]: (e: Event) => void;
};
export type DocumentWithHandler = Document & {
    onLoadHandler: () => void;
};
export type HTMLElementFromTemplate = HTMLElement & {
    lastTemplateEvaluation: string;
};
