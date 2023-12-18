export interface Cog {
    render: (rootElement: HTMLElement) => void;
    variable: <T>(
        name: string,
        value: T,
        template?: TemplateName
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
    expressions: Expression[];
    reactive: boolean;
};

type ReactiveNodeId = number;

export type ReactiveNode = {
    id: ReactiveNodeId;
    parentId: ReactiveNodeId | null;
    element: HTMLElement;
    template: HTMLString;
    lastTemplateEvaluation: CogHTMLElement;
    attributes: Attribute[];
    expressions: Expression[];
    shouldUpdate: boolean;
    newAttributes: string[];
    templateName: TemplateName | null;
};

export type UnknownFunction = (...args: unknown[]) => unknown;

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
    templates: StateTemplates | null;
    updatedElements: ReactiveNodeId[];
    elementsUpdatedKeys: Record<ReactiveNodeId, StateKey[]>;
    updatedCustomElements: ReactiveNodeId[];
    customElementsUpdatedKeys: Record<ReactiveNodeId, StateKey[]>;
    get value(): State;
    registerTemplateState(
        template: TemplateName,
        elementId: ReactiveNodeId
    ): void;
    getTemplateState(template: TemplateName): TemplateState;

    initializeTemplateState: (
        template: TemplateName,
        stateKey: StateKey,
        value: unknown
    ) => void;
    updateTemplateState(
        template: TemplateName,
        elementId: ReactiveNodeId,
        stateKey: StateKey,
        value: unknown
    ): void;
    initializeGlobalState: <T>(stateKey: StateKey, value: T) => void;
    updateGlobalState: <T>(stateKey: StateKey, value: T) => void;
    _registerGlobalStateUpdate: (stateKey: StateKey) => void;
    clearUpdates: () => void;
};

export type TemplateName = string;

export type StateTemplates = Record<TemplateName, TemplateState>;

export type TemplateState = {
    keys: StateKey[];
    initial: Record<StateKey, StateValue>;
    customElements: Record<ReactiveNodeId, CustomElementState>;
};

export type CustomElementState = Record<StateKey, StateValue>;

export type StateKey = string;
export type State = Record<StateKey, StateValue>;
export type StateValue = {
    value: unknown;
    dependents: ReactiveNodeId[];
    computants: StateKey[];
    dependencies: StateKey[];
};

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
    get: (id: number) => ReactiveNode;
    add: (item: ReactiveNode) => void;
    update: (
        index: number,
        property: keyof ReactiveNode,
        value: ReactiveNode[keyof ReactiveNode]
    ) => void;
    clean: () => void;
    id: () => number;
};

export type CogHTMLElement = HTMLElement & {
    cogAnchorId: number;
};

export type Expression = {
    start: number;
    end: number;
    value: string;
    dependencies: string[];
    evaluated: string | null;
};
