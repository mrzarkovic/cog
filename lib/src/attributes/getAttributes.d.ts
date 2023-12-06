import { Attribute, ChangedAttribute } from "../types";
export declare const getAttributes: (element: HTMLElement) => Attribute[];
export declare const changedAttributesToAttributes: (changedAttributes: ChangedAttribute[]) => Attribute[];
