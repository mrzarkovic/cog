import { State } from "../../types";
export declare const makeEventHandler: (eventName: string | undefined, element: Element, state: State) => (e: Event) => void;
