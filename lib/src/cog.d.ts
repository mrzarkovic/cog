import { type Cog } from "./types";
export declare const init: () => Cog;
export declare const variable: <T>(name: string, value: T, template?: string | undefined) => {
    value: T;
    set: (newVal: T) => void;
}, render: (rootElement: HTMLElement) => void;
