## Why

A stray `console.log(element)` was left in `registerReactiveNode.ts` during the reconcile refactor. It logs every reactive element to the browser console during registration, producing noise for all consumers of the library.

## What Changes

- Remove the debug `console.log` statement from `registerReactiveNode()`

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `reactive-node-registration`: Remove unintended console output during element registration

## Impact

- `src/nodes/registerReactiveNode.ts`: Remove line 81 (`console.log(element)`)
