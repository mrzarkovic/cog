import { Expression, State } from "../types";
export declare const evaluateTemplate: (template: string, expressions: Expression[], state: State) => string;
export declare const extractTemplateExpressions: (template: string) => Expression[];
