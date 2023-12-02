import { State } from "../types";
export declare const makeEventHandler: (eventName: string, element: Element, state: State) => (e: Event) => void;
