import "@testing-library/jest-dom";

import { evaluateExpression } from "../expressions/evaluateExpression";

const getWindowErrorPromise = () =>
    new Promise((resolve, reject) => {
        window.addEventListener("error", (event) => {
            event.preventDefault();
            reject(event.error);
        });
    });

describe("evaluateExpression", () => {
    beforeEach(() => {});

    afterEach(() => {});

    test("that expression evaluates in the given state", () => {
        const state = { x: 1, y: 2 };
        const expression = "x + y";
        const result = evaluateExpression(expression, state);

        expect(result).toBe(3);
    });

    test("expressions that evaluate to arrays", () => {
        const state = { users: [{ name: "John" }, { name: "Jane" }] };
        const expression = "users.map( user => `<div>${user.name}</div>` )";
        const result = evaluateExpression(expression, state);

        expect(result).toEqual("<div>John</div><div>Jane</div>");
    });

    test("handle expressions that reference undefined variables", () => {
        const state = { x: 1 };
        const expression = "x + y";

        expect(() => evaluateExpression(expression, state)).toThrow();
    });
});
