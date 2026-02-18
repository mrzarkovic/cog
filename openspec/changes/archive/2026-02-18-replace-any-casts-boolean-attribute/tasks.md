## 1. Replace `as any` casts

- [x] 1.1 Replace `(changedNode as any)[optionalAttribute] = true` with `(changedNode as Record<string, boolean>)[optionalAttribute] = true`
- [x] 1.2 Replace `(changedNode as any)[optionalAttribute] = false` with `(changedNode as Record<string, boolean>)[optionalAttribute] = false`
- [x] 1.3 Remove both `// eslint-disable-next-line @typescript-eslint/no-explicit-any` comments

## 2. Verify

- [x] 2.1 Run TypeScript compiler to confirm no type errors
- [x] 2.2 Run existing tests to confirm no regressions
