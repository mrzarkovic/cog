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
    element: HTMLElement;
    template: HTMLString;
    lastTemplateEvaluation: HTMLString;
    parentAttributes: Attribute[];
};

export type ChangedAttribute = {
    name: string;
    newValue: string | number | boolean | null | undefined;
};

export type ChangedNode = {
    node: HTMLElement;
    newNode: HTMLElement;
    content?: HTMLString;
    attributes?: ChangedAttribute[];
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

export type ReactiveNodesList = {
    list: ReactiveNode[];
    get value(): ReactiveNode[];
    add: (item: ReactiveNode) => void;
    updateLastTemplateEvaluation: (index: number, value: string) => void;
};

export type CustomElementsList = ReactiveNodesList & {
    clean: () => void;
};
