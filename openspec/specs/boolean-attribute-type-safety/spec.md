# boolean-attribute-type-safety Specification

## Purpose
TBD - created by archiving change replace-any-casts-boolean-attribute. Update Purpose after archive.
## Requirements
### Requirement: Boolean attribute property assignments use proper typing

The `handleBooleanAttribute` function SHALL assign boolean DOM properties using a typed record cast (`Record<string, boolean>`) instead of `any`. No `as any` casts or `eslint-disable` comments for `@typescript-eslint/no-explicit-any` SHALL be present in the function.

#### Scenario: Setting a boolean attribute to true uses typed cast

- **WHEN** `handleBooleanAttribute` is called with a truthy `newValue`
- **THEN** the DOM property MUST be set to `true` via a `Record<string, boolean>` cast, not `as any`

#### Scenario: Setting a boolean attribute to false uses typed cast

- **WHEN** `handleBooleanAttribute` is called with a falsy `newValue`
- **THEN** the DOM property MUST be set to `false` via a `Record<string, boolean>` cast, not `as any`

#### Scenario: No eslint-disable comments for explicit-any remain

- **WHEN** the `handleBooleanAttribute` source file is inspected
- **THEN** there MUST be zero `eslint-disable` comments for `@typescript-eslint/no-explicit-any`

