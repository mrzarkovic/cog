## Context

`handleBooleanAttribute` in `src/attributes/handleBooleanAttribute.ts` dynamically sets DOM element properties by string name (e.g., `element["checked"] = true`). TypeScript's `HTMLElement` type lacks an index signature, so the current code uses `as any` casts to bypass type checking. Two `eslint-disable` comments suppress the resulting lint warnings.

## Goals / Non-Goals

**Goals:**

- Replace `as any` with a narrower typed cast
- Remove `eslint-disable` comments

**Non-Goals:**

- Refactoring the overall approach to boolean attribute handling
- Adding runtime validation of property names

## Decisions

### Decision 1: Use `Record<string, boolean>` cast

Cast `changedNode` to `Record<string, boolean>` instead of `any`. This preserves the dynamic string-keyed property access while constraining the assigned value to `boolean`.

**Alternatives considered:**

- **`(changedNode as unknown as Record<string, boolean>)`**: More "correct" in strict TypeScript (double-cast through `unknown`), but unnecessarily verbose for this use case. A single `as` is sufficient because `HTMLElement` is an object type compatible with `Record`.
- **Type assertion function**: Overkill for two lines of code.
- **Interface extension**: Would require declaring a custom interface extending `HTMLElement` with an index signature — adds complexity without real benefit.

## Risks / Trade-offs

- **Risk**: The `Record<string, boolean>` cast loses access to other `HTMLElement` methods/properties on the same reference. → **Mitigation**: The cast is only used inline for the single property assignment; `changedNode` remains typed as `HTMLElement` for all other operations.
