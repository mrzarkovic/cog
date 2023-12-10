import { ChangedNode } from "../types";
export declare function compareTextNodes(oldNode: HTMLElement, newNode: HTMLElement): ChangedNode[];
export declare function compareChildNodes(oldNode: HTMLElement, newNode: HTMLElement): ChangedNode[];
export declare function compareCustomElementChildren(oldElement: HTMLElement, newElement: HTMLElement): ChangedNode[];
export declare function compareNodes(oldNode: HTMLElement, newNode: HTMLElement): ChangedNode[];
