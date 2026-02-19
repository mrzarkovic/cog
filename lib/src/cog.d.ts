import { type Cog } from "./types";
export declare const init: () => Cog;
export declare const variable: <T>(name: string, value: T, template?: import("./types").TemplateName) => {
    set value(newVal: T): any;
    get value(): T;
    set: (newVal: T) => void;
}, render: (rootElement: HTMLElement) => void;
