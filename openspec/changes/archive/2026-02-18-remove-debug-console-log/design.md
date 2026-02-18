## Context

`registerReactiveNode()` in `src/nodes/registerReactiveNode.ts` contains a `console.log(element)` on line 81, left over from reconcile refactoring. The function is called for every reactive element registration, so this log fires frequently and produces noise in the browser console for all library consumers.

## Goals / Non-Goals

**Goals:**
- Remove the debug `console.log` statement

**Non-Goals:**
- Adding structured logging or a debug mode (future concern)
- Changing any other behavior of `registerReactiveNode`

## Decisions

### Decision 1: Simple removal, no replacement

Remove the `console.log(element)` line entirely. No replacement logging is needed — this was never an intentional feature. If structured debug logging is desired later, it should be designed as its own change.

## Risks / Trade-offs

- **Risk**: None meaningful. The `console.log` is purely a debug artifact with no consumers.
