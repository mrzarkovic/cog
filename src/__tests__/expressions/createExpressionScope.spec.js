import "@testing-library/jest-dom";
import { createExpressionScope } from "../../expressions/createExpressionScope";

describe("createExpressionScope", () => {
    test("create scoped function for executing the expression", () => {
        const expressionWithScope = createExpressionScope("a + b", {
            a: 1,
            b: 2,
        });

        expect(expressionWithScope({ a: 2, b: 3 })).toStrictEqual(5);
    });

    test("fail to call scoped function when state is missing", () => {
        const expressionWithScope = createExpressionScope("a + b", {
            a: 1,
        });

        expect(() => {
            expressionWithScope({
                a: 0,
            });
        }).toThrow("b is not defined");
    });
});
