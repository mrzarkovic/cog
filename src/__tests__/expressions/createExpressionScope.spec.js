import "@testing-library/jest-dom";
import { createExpressionScope } from "../../expressions/createExpressionScope";

describe("createExpressionScope", () => {
    test("create scoped function for executing the expression", () => {
        const expressionWithScope = createExpressionScope("a + b", {
            a: { value: 1, dependents: [] },
            b: { value: 2, dependents: [] },
        });

        expect(
            expressionWithScope({ a: { value: 2 }, b: { value: 3 } }),
        ).toStrictEqual(5);
    });

    test("fail to call scoped function when state is missing", () => {
        const expressionWithScope = createExpressionScope("a + b", {
            a: { value: 1, dependents: [] },
        });

        expect(() => {
            expressionWithScope({
                a: { value: 0, dependents: [] },
            });
        }).toThrow(); // Will throw because 'b' is missing from state
    });

    test("same expression works with different state shapes", () => {
        // Create expression scope with initial state
        const expressionWithScope = createExpressionScope("count", {
            count: { value: 1, dependents: [] },
        });

        // Should work with original state shape
        expect(
            expressionWithScope({ count: { value: 5, dependents: [] } }),
        ).toStrictEqual(5);

        // Should also work with extended state shape (simulating parent state merged with child state)
        expect(
            expressionWithScope({
                count: { value: 10, dependents: [] },
                dataParent: { value: "test", dependents: [] },
                otherValue: { value: 42, dependents: [] },
            }),
        ).toStrictEqual(10);
    });

    test("expression can access variables from extended state", () => {
        // Create expression scope that references a variable
        const expressionWithScope = createExpressionScope("dataParent", {
            count: { value: 1, dependents: [] },
        });

        // When called with extended state that includes dataParent, it should work
        expect(
            expressionWithScope({
                count: { value: 5, dependents: [] },
                dataParent: { value: "hello", dependents: [] },
            }),
        ).toStrictEqual("hello");
    });

    test("array methods work with cached expressions", () => {
        // Create expression with array map
        const expressionWithScope = createExpressionScope(
            "items.map(x => x * 2)",
            {
                items: { value: [1, 2, 3], dependents: [] },
            },
        );

        // Should work correctly
        expect(
            expressionWithScope({
                items: { value: [1, 2, 3], dependents: [] },
            }),
        ).toStrictEqual([2, 4, 6]);

        // Should work with different state shape
        expect(
            expressionWithScope({
                items: { value: [5, 10], dependents: [] },
                otherVar: { value: "test", dependents: [] },
            }),
        ).toStrictEqual([10, 20]);
    });
});
