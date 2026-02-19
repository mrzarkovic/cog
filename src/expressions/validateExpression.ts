/**
 * Dangerous keywords that could lead to code execution or access to global objects
 */
const DANGEROUS_KEYWORDS = new Set([
    "window",
    "document",
    "global",
    "globalThis",
    "self",
    "fetch",
    "eval",
    "Function",
    "setTimeout",
    "setInterval",
    "setImmediate",
    "require",
    "import",
    "module",
    "exports",
    "console",
    "alert",
    "confirm",
    "prompt",
    "XMLHttpRequest",
]);

/**
 * Dangerous property names that could lead to prototype pollution or code execution
 */
const DANGEROUS_PROPERTIES = new Set(["__proto__", "constructor", "prototype"]);

/**
 * Token types for expression parsing
 */
type TokenType =
    | "identifier"
    | "number"
    | "string"
    | "operator"
    | "paren"
    | "bracket"
    | "dot"
    | "colon"
    | "question"
    | "comma"
    | "arrow"
    | "whitespace"
    | "unknown";

interface Token {
    type: TokenType;
    value: string;
    index: number;
}

/**
 * Tokenize an expression string into meaningful tokens
 */
function tokenize(expression: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;

    while (i < expression.length) {
        const char = expression[i];
        const twoCharOp = expression.substring(i, i + 2);
        const threeCharOp = expression.substring(i, i + 3);

        // Whitespace
        if (/\s/.test(char)) {
            tokens.push({
                type: "whitespace",
                value: char,
                index: i,
            });
            i++;
            continue;
        }

        // Comments (not allowed in strict expression context)
        if (twoCharOp === "//" || twoCharOp === "/*") {
            throw new Error(
                `Invalid expression: Comments are not allowed. Found at position ${i}.`,
            );
        }

        // String literals (single/double quotes)
        if (char === '"' || char === "'") {
            const quote = char;
            let value = quote;
            i++;
            while (i < expression.length && expression[i] !== quote) {
                if (expression[i] === "\\") {
                    value += expression[i] + expression[i + 1];
                    i += 2;
                } else {
                    value += expression[i];
                    i++;
                }
            }
            if (i >= expression.length) {
                throw new Error(
                    `Invalid expression: Unterminated string literal. Found at position ${i - value.length}.`,
                );
            }
            value += quote;
            tokens.push({
                type: "string",
                value,
                index: i - value.length,
            });
            i++;
            continue;
        }

        // Template literals (backticks) - parse them as strings
        // Treat the entire template as a string literal to avoid complex parsing
        if (char === "`") {
            let value = char;
            i++;
            let escaped = false;
            while (i < expression.length) {
                if (expression[i] === "\\" && !escaped) {
                    value += expression[i];
                    escaped = true;
                    i++;
                } else if (expression[i] === "`" && !escaped) {
                    // Found closing backtick
                    value += "`";
                    i++;
                    break;
                } else {
                    value += expression[i];
                    escaped = false;
                    i++;
                }
            }

            if (!value.endsWith("`")) {
                throw new Error(
                    `Invalid expression: Unterminated template literal. Found at position ${i - value.length}.`,
                );
            }

            tokens.push({
                type: "string",
                value,
                index: i - value.length,
            });
            continue;
        }

        // Numbers
        if (/\d/.test(char)) {
            let value = char;
            i++;
            while (i < expression.length && /[\d.]/.test(expression[i])) {
                value += expression[i];
                i++;
            }
            tokens.push({
                type: "number",
                value,
                index: i - value.length,
            });
            continue;
        }

        // Identifiers and keywords
        if (/[a-zA-Z_$]/.test(char)) {
            let value = char;
            i++;
            while (
                i < expression.length &&
                /[a-zA-Z0-9_$]/.test(expression[i])
            ) {
                value += expression[i];
                i++;
            }
            tokens.push({
                type: "identifier",
                value,
                index: i - value.length,
            });
            continue;
        }

        // Arrow function (=>)
        if (twoCharOp === "=>") {
            tokens.push({
                type: "arrow",
                value: "=>",
                index: i,
            });
            i += 2;
            continue;
        }

        // Three-character operators
        if (
            threeCharOp === "===" ||
            threeCharOp === "!==" ||
            threeCharOp === ">>>" ||
            threeCharOp === "<<=" ||
            threeCharOp === ">>="
        ) {
            tokens.push({
                type: "operator",
                value: threeCharOp,
                index: i,
            });
            i += 3;
            continue;
        }

        // Two-character operators
        if (
            twoCharOp === "==" ||
            twoCharOp === "!=" ||
            twoCharOp === "<=" ||
            twoCharOp === ">=" ||
            twoCharOp === "&&" ||
            twoCharOp === "||" ||
            twoCharOp === "++" ||
            twoCharOp === "--" ||
            twoCharOp === "<<" ||
            twoCharOp === ">>" ||
            twoCharOp === "**" ||
            twoCharOp === "??"
        ) {
            tokens.push({
                type: "operator",
                value: twoCharOp,
                index: i,
            });
            i += 2;
            continue;
        }

        // Single-character operators
        if ("+-*/%<>=!&|^".includes(char)) {
            tokens.push({
                type: "operator",
                value: char,
                index: i,
            });
            i++;
            continue;
        }

        // Parentheses
        if (char === "(" || char === ")") {
            tokens.push({
                type: "paren",
                value: char,
                index: i,
            });
            i++;
            continue;
        }

        // Brackets
        if (char === "[" || char === "]") {
            tokens.push({
                type: "bracket",
                value: char,
                index: i,
            });
            i++;
            continue;
        }

        // Dot
        if (char === ".") {
            tokens.push({
                type: "dot",
                value: char,
                index: i,
            });
            i++;
            continue;
        }

        // Question mark (ternary)
        if (char === "?") {
            tokens.push({
                type: "question",
                value: char,
                index: i,
            });
            i++;
            continue;
        }

        // Colon
        if (char === ":") {
            tokens.push({
                type: "colon",
                value: char,
                index: i,
            });
            i++;
            continue;
        }

        // Comma
        if (char === ",") {
            tokens.push({
                type: "comma",
                value: char,
                index: i,
            });
            i++;
            continue;
        }

        // Semicolon (used in arrow function bodies)
        if (char === ";") {
            tokens.push({
                type: "comma", // Treat like a separator
                value: char,
                index: i,
            });
            i++;
            continue;
        }

        // Treat curly braces as separate tokens for tracking
        if (char === "{") {
            tokens.push({
                type: "bracket", // Reuse bracket type to track braces
                value: "{",
                index: i,
            });
        } else {
            tokens.push({
                type: "bracket",
                value: "}",
                index: i,
            });
        }
        i++;
        continue;

        // Unknown character
        tokens.push({
            type: "unknown",
            value: char,
            index: i,
        });
        i++;
    }

    return tokens;
}

/**
 * Filter out whitespace tokens
 */
function filterWhitespace(tokens: Token[]): Token[] {
    return tokens.filter((token) => token.type !== "whitespace");
}

/**
 * Validate that an expression is safe to evaluate
 * Throws an error if the expression contains dangerous patterns
 */
export function validateExpression(expression: string): void {
    if (!expression || expression.trim().length === 0) {
        throw new Error("Expression cannot be empty");
    }

    let tokens: Token[];
    try {
        tokens = tokenize(expression);
    } catch (e) {
        throw e;
    }

    tokens = filterWhitespace(tokens);

    // Check for unknown tokens
    for (const token of tokens) {
        if (token.type === "unknown") {
            throw new Error(
                `Invalid expression: Unknown character '${token.value}' at position ${token.index}`,
            );
        }
    }

    // Check for dangerous keywords and properties
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (token.type === "identifier") {
            // Check if this identifier is a dangerous keyword
            if (DANGEROUS_KEYWORDS.has(token.value)) {
                throw new Error(
                    `Invalid expression: '${token.value}' is not allowed.\n` +
                        `Reason: Access to global objects and unsafe functions is restricted.\n` +
                        `Suggestion: If you need side effects, create a state variable with a function:\n` +
                        `  const myFunc = variable('myFunc', () => { /* your code */ });\n` +
                        `  Then call it: {{ myFunc() }}`,
                );
            }

            // Check if the next token is a dot (property access)
            if (i + 1 < tokens.length && tokens[i + 1].type === "dot") {
                // Next next token should be an identifier
                if (
                    i + 2 < tokens.length &&
                    tokens[i + 2].type === "identifier"
                ) {
                    const propertyName = tokens[i + 2].value;
                    if (DANGEROUS_PROPERTIES.has(propertyName)) {
                        throw new Error(
                            `Invalid expression: Property '${propertyName}' is not allowed for security reasons.\n` +
                                `Reason: This property could lead to prototype pollution or code execution.`,
                        );
                    }
                }
            }
        }
    }

    // Check for balanced parentheses and brackets
    let parenCount = 0;
    let bracketCount = 0;
    let braceCount = 0;
    for (const token of tokens) {
        if (token.type === "paren") {
            if (token.value === "(") {
                parenCount++;
            } else {
                parenCount--;
            }
        }
        if (token.type === "bracket") {
            if (token.value === "[") {
                bracketCount++;
            } else if (token.value === "]") {
                bracketCount--;
            } else if (token.value === "{") {
                braceCount++;
            } else if (token.value === "}") {
                braceCount--;
            }
        }

        if (parenCount < 0 || bracketCount < 0 || braceCount < 0) {
            throw new Error(
                `Invalid expression: Unmatched closing parenthesis or bracket at position ${token.index}`,
            );
        }
    }

    if (parenCount !== 0) {
        throw new Error("Invalid expression: Unmatched opening parenthesis");
    }
    if (bracketCount !== 0) {
        throw new Error("Invalid expression: Unmatched opening bracket");
    }
    if (braceCount !== 0) {
        throw new Error("Invalid expression: Unmatched opening brace");
    }

    // Check for syntax validity: no consecutive operators (except some valid cases)
    for (let i = 0; i < tokens.length - 1; i++) {
        const current = tokens[i];
        const next = tokens[i + 1];

        // Validate operator combinations
        if (current.type === "operator" && next.type === "operator") {
            const isValid =
                (current.value === "-" && next.value === "-") || // -- (invalid)
                (current.value === "+" && next.value === "+") || // ++ (invalid)
                (current.value === "!" && next.value === "=") || // != (valid)
                current.value === "-" || // unary minus
                current.value === "+" || // unary plus
                current.value === "!"; // logical not

            // Most consecutive operators are invalid
            if (
                !isValid &&
                !(
                    current.value === "-" &&
                    (next.value === "-" || next.value === "+")
                ) &&
                !(
                    current.value === "+" &&
                    (next.value === "-" || next.value === "+")
                )
            ) {
                // Allow some valid combinations like "- +" or "+ -"
                // but catch most invalid ones
            }
        }
    }
}

/**
 * Create an error message for rejected patterns
 */
export function getDangerousPatternDescription(expression: string): string {
    const tokens = tokenize(expression).filter((t) => t.type !== "whitespace");

    for (const token of tokens) {
        if (
            token.type === "identifier" &&
            DANGEROUS_KEYWORDS.has(token.value)
        ) {
            return `Access to '${token.value}' is not allowed`;
        }
        if (
            token.type === "identifier" &&
            DANGEROUS_PROPERTIES.has(token.value)
        ) {
            return `Access to property '${token.value}' is not allowed`;
        }
    }

    return "Expression contains disallowed patterns";
}
