import "@testing-library/jest-dom";

import { findNextTemplateExpression } from "../util/helpers/findNextTemplateExpression";

describe("findNextTemplateExpression", () => {
    test("finds the next template expression start and end index", () => {
        const template = "Hello {{name}}!";
        const result = findNextTemplateExpression(template);

        expect(result).toEqual({ start: 6, end: 13 });
    });

    test("return -1 for end if no expression is found", () => {
        const template = "Hello }} world {{!";
        const result = findNextTemplateExpression(template);

        expect(result.end).toEqual(-1);
    });
});
