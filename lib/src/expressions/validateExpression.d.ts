/**
 * Validate that an expression is safe to evaluate
 * Throws an error if the expression contains dangerous patterns
 */
export declare function validateExpression(expression: string): void;
/**
 * Create an error message for rejected patterns
 */
export declare function getDangerousPatternDescription(expression: string): string;
