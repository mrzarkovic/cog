import "@testing-library/jest-dom";
import { getAttributes } from "../../attributes/getAttributes";

describe("getAttributes", () => {
    test("get attributes from element", () => {
        const element = document.createElement("div");
        element.setAttribute("data-test", "test");
        const attributes = getAttributes(element, {});

        expect(attributes).toStrictEqual([
            {
                name: "data-test",
                value: "test",
                expressions: [],
                reactive: false,
            },
        ]);
    });

    test("get attributes with expression from element", () => {
        const element = document.createElement("div");
        const value = "{{test}}";
        element.setAttribute("data-test", value);
        const attributes = getAttributes(element, {});

        expect(attributes).toStrictEqual([
            {
                name: "data-test",
                value,
                expressions: [
                    {
                        end: value.length - 1,
                        start: 0,
                        value: "test",
                        evaluated: null,
                        dependencies: [],
                    },
                ],
                reactive: true,
            },
        ]);
    });
});
