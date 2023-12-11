import "@testing-library/jest-dom";
import { evaluateExpression } from "../../expressions/evaluateExpression";

describe("evaluateExpression", () => {
    test("execute state scope expression function", () => {
        const evaluatedExpression = evaluateExpression(
            (state) => {
                const a = state["a"];
                const b = state["b"];

                return a + b;
            },
            {
                a: 1,
                b: 2,
            }
        );

        expect(evaluatedExpression).toStrictEqual(3);
    });

    test("execute state scope expression function that returns an array", () => {
        const evaluatedExpression = evaluateExpression(
            (state) => {
                const items = state["items"];
                const a = state["a"];
                const b = state["b"];

                return items.map((item) => item + a + b);
            },
            {
                items: [1, 2, 3],
                a: 1,
                b: 2,
            }
        );

        expect(evaluatedExpression).toStrictEqual("456");
    });
});
