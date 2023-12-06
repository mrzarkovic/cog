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
    id: number;
    parentId: number | null;
    element: HTMLElement;
    template: HTMLString;
    lastTemplateEvaluation: HTMLString | null;
    attributes: Attribute[];
};

export type ChangedAttribute = {
    name: string;
    newValue: string | number | boolean | null | undefined;
};

export type ChangedNode = {
    node: HTMLElement;
    content?: HTMLString;
    attributes?: ChangedAttribute[];
    toBeAdded?: HTMLElement[];
    toBeRemoved?: HTMLElement[];
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

export type ReactiveNodeIndex = { [id: number]: number };

export type ReactiveNodesList = {
    index: ReactiveNodeIndex;
    list: ReactiveNode[];
    lastId: number;
    get value(): ReactiveNode[];
    add: (item: ReactiveNode) => void;
    update: (
        index: number,
        property: keyof ReactiveNode,
        value: ReactiveNode[keyof ReactiveNode]
    ) => void;
    clean: (list: ReactiveNode[]) => void;
    id: () => number;
};

export type CogHTMLElement = HTMLElement & {
    cogAnchorId: number;
};
