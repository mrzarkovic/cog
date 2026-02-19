## 1. Expression Validator Implementation

- [x] 1.1 Create `src/expressions/validateExpression.ts` module with safe pattern whitelist
- [x] 1.2 Implement tokenizer to parse expression into meaningful units
- [x] 1.3 Implement allowlist for safe identifiers and operators (whitelist approach)
- [x] 1.4 Add checks for dangerous keywords (`window`, `document`, `fetch`, `eval`, `Function`, `__proto__`, etc.)
- [x] 1.5 Add checks for syntax validity (matched parentheses, valid operator usage)
- [x] 1.6 Implement helper function to extract dangerous patterns for error messages

## 2. Validator Testing

- [x] 2.1 Create `src/__tests__/expressions/validateExpression.spec.js` test file
- [x] 2.2 Add tests for safe patterns: property access, arithmetic, operators, method calls
- [x] 2.3 Add tests for rejected patterns: `window.*`, `fetch`, `eval`, `Function`, `__proto__`
- [x] 2.4 Add tests for edge cases: string literals containing "window", comments with dangerous patterns
- [x] 2.5 Add tests for error message clarity and helpfulness
- [x] 2.6 Achieve 100% code coverage for validator module

## 3. Cache Key Optimization

- [x] 3.1 Create `hashExpression()` helper function in `src/expressions/createExpressionScope.ts`
- [x] 3.2 Replace cache key generation to use hash instead of state snapshot
- [ ] 3.3 Verify cache hit rate remains high with existing test suite
- [ ] 3.4 Profile performance improvement (target: 50-70% reduction in key generation)

## 4. Validator Integration

- [x] 4.1 Integrate `validateExpression()` call into `createExpressionScope()`
- [x] 4.2 Throw validation error with helpful message if expression is unsafe
- [x] 4.3 Ensure validation happens before `new Function()` is called
- [ ] 4.4 Test error handling and error message generation (needs debugging)

## 5. Backward Compatibility Testing

- [ ] 5.1 Run full existing test suite (`npm test`) against changes
- [ ] 5.2 Verify all example apps work unchanged (counter, tic-tac-toe, todo, playground)
- [ ] 5.3 Test that safe expressions still produce identical results as before
- [ ] 5.4 Document any unsafe expressions that now reject (should be empty list ideally)

## 6. Documentation and Migration Guide

- [ ] 6.1 Update README.md with section on expression safety and limitations
- [ ] 6.2 Add examples of safe vs. unsafe patterns in README
- [ ] 6.3 Document the workaround: use `variable()` functions for unsafe operations
- [ ] 6.4 Create migration guide for any apps that have unsafe expressions
- [ ] 6.5 Update inline code comments in `createExpressionScope.ts` and `validateExpression.ts`

## 7. Performance Verification

- [ ] 7.1 Benchmark cache key generation time with 50+ expressions and 20+ state variables
- [ ] 7.2 Measure FPS stability on playground example with frequent updates
- [ ] 7.3 Compare profile before/after optimization (use browser DevTools or Node profiling)
- [ ] 7.4 Document performance metrics in a comment or separate file

## 8. Final Verification

- [ ] 8.1 Run full test suite one more time (`npm test`)
- [ ] 8.2 Verify TypeScript compilation with no errors (`npm run build`)
- [ ] 8.3 Check bundle size hasn't increased significantly
- [ ] 8.4 Review all changes for security correctness
- [ ] 8.5 Prepare commit message and change summary
