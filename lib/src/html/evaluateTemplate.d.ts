import { Expression, State } from "../types";
export declare const evaluateTemplate: (template: string, expressions: Expression[], state: State, stateChanges?: string[]) => string;
/**
 * Extracts all template expressions from a template string.
 * start and end are relative to the last template expression.
 */
export declare const extractTemplateExpressions: (template: string, state: State) => Expression[];
