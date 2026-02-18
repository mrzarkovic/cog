## Why

`handleBooleanAttribute.ts` uses `as any` casts to dynamically set DOM element properties by string name. These casts suppress all type checking and allow any value to be assigned, reducing type safety. Replacing them with a narrower type preserves the dynamic property access while ensuring only boolean values are assigned.

## What Changes

- Replace two `(changedNode as any)[optionalAttribute]` casts with a properly typed alternative using `Record<string, boolean>`
- Remove the associated `eslint-disable` comments that suppressed the `@typescript-eslint/no-explicit-any` rule

## Capabilities

### New Capabilities

- `boolean-attribute-type-safety`: Ensure boolean attribute property assignments use proper typing instead of `any` casts

### Modified Capabilities

_(none)_

## Impact

- `src/attributes/handleBooleanAttribute.ts`: Replace `as any` casts and remove eslint-disable comments
