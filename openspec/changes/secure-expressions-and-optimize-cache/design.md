## Context

### Current State

Cog currently evaluates template expressions using `new Function()` with arbitrary JavaScript extracted from HTML templates. This approach:

- **Security issue**: Allows attackers to inject code like `{{ window.localStorage }}` or `{{ fetch('/steal-data') }}`
- **Performance issue**: Cache keys depend on full state snapshot (`Object.keys(state)` + `JSON.stringify()`), causing O(n) overhead per expression evaluation
- **Simplicity**: Developers can use any JavaScript they want, but this freedom creates attack surface

### Current Expression Flow

```
Template {{ expression }}
    ↓
sanitizeExpression() [removes newlines only]
    ↓
createExpressionScope(expression, state)
    ├─ Calculate cache key: expression + JSON.stringify(Object.keys(state).join(""))
    ├─ If not cached: new Function(`return (state) => {...}`)
    └─ Return compiled function
    ↓
evaluateExpression(fn, state)
    └─ Execute fn(state)
```

### Constraints

- **Backward compatibility**: Existing apps must not break (must support same safe syntax)
- **Simplicity**: Even with security, API surface must remain beginner-friendly
- **Performance**: Must reduce cache key overhead by ~50% at minimum
- **Bundle size**: Cog is small (8KB gzipped); expression validator should not double the size

---

## Goals / Non-Goals

**Goals:**

1. Eliminate XSS vector via arbitrary code injection in templates
2. Reduce expression evaluation overhead, enabling stable 60fps on 1000+ node apps
3. Maintain backward compatibility with all safe existing Cog code
4. Provide clear error messages when unsafe expressions are rejected
5. Support all common expression patterns: property access, arithmetic, method calls, ternary operators

**Non-Goals:**

- Create a full expression language or DSL parser (keep it simple)
- Support all JavaScript features (intentional restriction)
- Add runtime introspection or debuggability tools
- Support async/await or promises in expressions
- Compete with more powerful templating systems; serve Cog's beginner audience

---

## Decisions

### Decision 1: Expression Validation Strategy

**Choice**: Static whitelist-based validator using regex and token parsing, NOT a full AST parser.

**Rationale**:

- Simple to understand and maintain (one focused module)
- Bundle size stays small (~2-3KB)
- Fast validation (regex + string ops, not AST traversal)
- Easy to update allowed/forbidden patterns

**Alternatives considered**:

- Full parser (e.g., Acorn, Babel): Too large (~40KB), overkill for simple expressions
- Dynamic Function + sandbox: Possible but adding a sandbox library increases complexity and bundle size
- Regex only: Naive regex can't handle syntax correctly (e.g., "window" inside a string literal looks like "window" access); token parsing fixes this

**How it works**:

1. Tokenize expression into meaningful units (identifiers, operators, literals, etc.)
2. Walk tokens and reject if we see dangerous names like `window`, `fetch`, `eval`
3. Verify syntax is well-formed (matched parens, valid operators)
4. Reject any patterns we can't confidently validate

**Safe patterns allowed**:

- Property access: `user`, `user.name`, `user['name']`, `items[0]`
- Operators: `+`, `-`, `*`, `/`, `%`, `<`, `>`, `==`, `===`, `&&`, `||`, `!`, `?:`
- Method calls: `items.map(...)`, `text.toUpperCase()`, `arr.filter(...)`
- Literals: `42`, `"hello"`, `true`, `null`, `undefined`
- Variables/function calls: `count`, `format(value)`
- Arrow functions in callbacks: `items.map(x => x * 2)` (only in method arguments)

**Rejected patterns**:

- `window.*`, `document.*`, `global.*`
- `fetch`, `eval`, `Function`, `setTimeout`, `setInterval`
- `__proto__`, `constructor`, `prototype`
- `import`, `require`, `module`

### Decision 2: Cache Key Generation

**Choice**: Hash of expression content only (not dependent on state variables).

**Current (problematic)**:

```typescript
const index = expression + JSON.stringify(Object.keys(state).join(""));
```

**New approach**:

```typescript
const index = hashExpression(expression);
// where hashExpression uses a simple hash function on expression string only
```

**Rationale**:

- Expression `{{ count + 1 }}` is valid whether state has 5 or 50 variables
- The compilation result depends only on the expression text, not the state shape
- Eliminates O(n) `Object.keys()` call per expression evaluation
- Reduces key generation from ~100 bytes of JSON to ~32 bytes of hash
- Expected performance improvement: ~60-70% reduction in key generation overhead

**Hash implementation**:

- Simple string hash (e.g., djb2 or similar) to avoid `JSON.stringify()` cost
- Or: use expression as key directly (simpler, slightly larger cache object)
- Trade-off: Cache might grow larger, but this is acceptable since we have ~50-100 unique expressions per app typically

**Example**:

```
Expression: "count + 1"
Old cache key: "count + 1(state with 20 keys)"  ← Changes if state changes
New cache key: "hash(count + 1)"  ← Stable, reusable across state mutations
```

### Decision 3: Backward Compatibility

**Choice**: Validation rejects unsafe patterns, but safe patterns work identically to before.

**How**:

- The validation step is additive (new code, runs before `new Function()`)
- If expression passes validation, compiled function works the same way
- No changes to `evaluateExpression()` or the function body generation
- Existing tests should pass as-is

**Migration**:

- Apps using only safe expressions: no changes needed
- Apps with unsafe expressions: they will error at compile time with helpful messages
- Error message guide: suggest moving unsafe operations to `variable()` functions

### Decision 4: Error Handling and Messages

**Choice**: Validate expressions at reactive node registration time, not at render time, and cache validation results.

**Why**:

- Errors are caught early (during `registerReactiveNode()`), not at runtime
- Developers see errors during development, not in production
- Validation result is memoized (don't re-validate same expression)

**Error message format**:

```
Invalid expression: "window.location"
Reason: Access to global objects (window, document, etc.) is not allowed.
Suggestion: If you need side effects, create a state variable with a function:
  const redirect = variable('redirect', (url) => { window.location = url; });
  Then call it: {{ redirect('https://...') }}
```

---

## Risks / Trade-offs

### Risk 1: Developers legitimately need unsafe operations

**Mitigation**: Emphasize that `variable()` functions can do anything. Move unsafe logic to state functions, keep templates data-only.

- Example: `const fetch = variable('fetch', async (url) => { return await fetch(url); })`
- This way, templates stay safe but app logic is unrestricted

### Risk 2: Expression validator misses an exploit

**Mitigation**:

- Keep validator simple and conservative (whitelist approach, not blacklist)
- Extensive unit tests for the validator (test both safe and unsafe patterns)
- Code review focuses on validator logic
- Document all allowed patterns clearly

### Risk 3: Performance regression if hash collisions occur

**Mitigation**: Use a good hash function (djb2 or similar) to minimize collisions. Given ~50-100 expressions per app, collision probability is negligible. If collisions occur, fall back to full expression as key.

### Risk 4: Cache memory growth

**Mitigation**: Cache is unbounded, but 1000 unique expressions is rare. If needed in the future, add LRU eviction. For now, this is acceptable given the trade-off.

### Risk 5: Breaking change if someone relies on arbitrary JavaScript

**Mitigation**:

- Communicate clearly in docs that this is a security-first change
- Provide migration path (move unsafe code to state functions)
- Version bump to reflect the change
- Test suites will fail fast for unsafe expressions, making migration obvious

---

## Implementation Plan

### Phase 1: Expression Validator (Priority: Security)

1. Create `src/expressions/validateExpression.ts` with safe pattern whitelist
2. Add unit tests for validator in `src/__tests__/expressions/validateExpression.spec.js`
3. Integrate validator into `createExpressionScope()` to reject unsafe expressions
4. Update error handling to provide clear messages

### Phase 2: Cache Optimization (Priority: Performance)

1. Implement `hashExpression()` helper in `src/expressions/createExpressionScope.ts`
2. Replace cache key generation to use hash only
3. Profile cache hit rate with existing tests

### Phase 3: Testing and Documentation

1. Update README with safe expression guide and examples
2. Add security section to docs
3. Run full test suite; update tests if needed for new validation
4. Manual testing on example apps (counter, tic-tac-toe, etc.)

### Phase 4: Deployment

1. Merge to main
2. Release as minor version (API compatible, but new restrictions)
3. Update npm README with migration guidance

---

## Open Questions

1. **Should we use a simple string hash or expression as key?**
    - String hash: smaller cache object keys, but need to ensure no collisions
    - Exact expression: larger keys, but guaranteed uniqueness
    - Decision: Use simple hash initially; profile and adjust if needed

2. **What should the LRU eviction threshold be, if we add it?**
    - For now: no eviction (unbounded cache)
    - If cache grows > 10KB, implement simple LRU
    - Decision: Deferred until metrics show it's needed

3. **Should we provide a "strict" vs "permissive" mode?**
    - Decision: No (for now). Keep it simple—one mode. If developers need more control, add it later.

4. **How do we handle template-scoped state variable functions?**
    - These can do anything (they're JavaScript)
    - The restriction applies only to template expressions
    - Decision: Document this clearly; functions in state can be unrestricted
