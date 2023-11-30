import { ReactiveNode } from "../types";
export declare const templatesStack: {
    stack: ReactiveNode[];
    readonly value: ReactiveNode[];
    add(item: ReactiveNode): void;
    clean(): void;
};
