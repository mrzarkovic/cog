import "@testing-library/jest-dom";
import { sanitizeExpression } from "../../expressions/sanitizeExpression";

describe("sanitizeExpression", () => {
    test("remove new lines from string", () => {
        const expression = "Hello,\r\nWorld!";
        const sanitizedExpression = sanitizeExpression(expression);

        expect(sanitizedExpression).toStrictEqual("Hello,World!");
    });
});
