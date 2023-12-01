export interface Cog {
    variable: <T>(
        name: string,
        value: T
    ) => {
        set value(newVal: T);
        get value(): T;
        set: (newVal: T) => void;
    };
}

export type HTMLString = string;

export type RootElement = {
    element: HTMLElement | null;
    get value(): HTMLElement;
};

export type Attribute = {
    name: string;
    value: string;
    reactive: boolean;
};

export type ReactiveNode = {
    element: HTMLElementFromTemplate;
    template: HTMLString;
    parentAttributes: Attribute[];
};

// TODO: Rename, not a tree
export type DOMTree = ReactiveNode[];

export type ChangedElement = {
    element: HTMLElement;
    newElement: HTMLElement;
    content?: HTMLString;
    attributes?: { name: string; newValue: string }[];
};

export type StateObject = {
    state: State | null;
    get value(): State;
    set: <T>(name: string, value: T) => void;
};
export type State = Record<string, unknown>;

export type ElementWithHandler = Element & {
    [key: string]: (e: Event) => void;
};
export type DocumentWithHandler = Document & { onLoadHandler: () => void };

// TODO: Rename, doesn't have to be from template
export type HTMLElementFromTemplate = HTMLElement & {
    lastTemplateEvaluation: string;
};
