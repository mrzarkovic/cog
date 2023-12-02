export function sanitizeExpression(expression: string) {
    return expression.replace(/[\r\n]+/g, "");
}
