import "@testing-library/jest-dom";
import { createExpressionScope } from "../../expressions/createExpressionScope";

describe("createExpressionScope", () => {
    test("create scoped function for executing the expression", () => {
        const expressionWithScope = createExpressionScope("a + b", {
            a: { value: 1, dependents: [] },
            b: { value: 2, dependents: [] },
        });

        expect(
            expressionWithScope({ a: { value: 2 }, b: { value: 3 } })
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
        }).toThrow("b is not defined");
    });
});
