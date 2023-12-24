import { Attribute, CogHTMLElement, Expression, ReactiveNodesList, State } from "../types";
export declare function assignDependents(elementId: number, expressions: Expression[], state: State, attributes: Attribute[]): void;
export declare function registerReactiveNode(elementId: number, reactiveNodes: ReactiveNodesList, originalElement: HTMLElement, template: string, state: State, attributes?: Attribute[], parentId?: number | null, templateName?: string | null): CogHTMLElement;
