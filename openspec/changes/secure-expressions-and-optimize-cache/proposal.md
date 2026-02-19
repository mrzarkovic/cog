## Why

Cog's expression evaluation system has two critical issues that block real-world adoption for medium-to-large apps (1000+ DOM nodes with frequent updates):

1. **Security vulnerability**: Expressions are evaluated using `new Function()` with arbitrary JavaScript from HTML templates. An attacker can inject code that accesses `window.*`, calls `fetch()`, or steals data. The current `sanitizeExpression()` only removes newlines—it doesn't restrict execution.

2. **Performance bottleneck**: Cache key generation recalculates `Object.keys(state)` and `JSON.stringify()` on every expression evaluation. With 20+ state variables and frequent updates (60fps target), this becomes a frame-rate killer—especially for apps with 1000+ reactive nodes where multiple expressions evaluate per frame.

Both problems compound: developers can't safely use Cog for data-sensitive apps, and those who try hit performance walls as their apps grow.

## What Changes

- **New safe expression evaluator**: Replaces `new Function()` with a secure parser that only allows:
    - Property access (e.g., `count`, `user.name`)
    - Array/object access (e.g., `items[0]`, `data['key']`)
    - Arithmetic/comparison operators (e.g., `a + b`, `x > 5`)
    - Method calls on safe types (e.g., `items.length`, `str.toUpperCase()`)
    - Ternary/logical operators (e.g., `a ? b : c`, `a && b`)
    - Rejects: `window.*`, `document.*`, `fetch`, `eval`, `Function`, etc.

- **Optimized cache key**: Use hash of expression only (not full state snapshot). Cache remains valid as long as expression doesn't change, dramatically reducing key generation overhead.

- **Updated security documentation**: Add guidance on what expressions can and cannot do, with examples of safe vs. unsafe patterns.

## Capabilities

### New Capabilities

- `safe-expression-evaluation`: Evaluate template expressions securely without risking arbitrary code injection. Supports arithmetic, property access, method calls on safe types, and logical operators.

### Modified Capabilities

<!-- No existing capability specs are changing at the requirement level. Implementation optimization. -->

## Impact

- **Code**: Core updates to `createExpressionScope.ts`, `evaluateExpression.ts`, new `validateExpression.ts` module
- **API**: No breaking changes to public API. `variable()` and `{{ }}` syntax remain the same.
- **Performance**: ~50-70% reduction in cache key generation time. Enables consistent 60fps on medium-sized apps.
- **Security**: Eliminates XSS vector via template injection. Safe for untrusted HTML or user-authored templates.
- **Testing**: New tests for expression validation (allowed vs. rejected patterns). Existing tests should pass (safe patterns are still allowed).
