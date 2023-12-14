import "@testing-library/jest-dom";
import {
    evaluateTemplate,
    extractTemplateExpressions,
} from "../../html/evaluateTemplate";

describe("evaluateTemplate", () => {
    test("extractTemplateExpressions", () => {
        const template = "Hello {{name}}! {{count}}";
        const expressions = extractTemplateExpressions(template);

        expect(expressions).toStrictEqual([
            {
                value: "name",
                start: 6,
                end: 13,
            },
            {
                value: "count",
                start: 2,
                end: 10,
            },
        ]);
    });

    test("evaluateTemplate", () => {
        const template = "Hello {{name}}! {{count}}";
        const expressions = [
            {
                value: "name",
                start: 6,
                end: 13,
            },
            {
                value: "count",
                start: 2,
                end: 10,
            },
        ];
        const evaluatedTemplate = evaluateTemplate(template, expressions, {
            name: {
                value: "John",
            },
            count: {
                value: 2,
            },
        });

        expect(evaluatedTemplate).toEqual("Hello John! 2");
    });
});
