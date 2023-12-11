import "@testing-library/jest-dom";

import { isCustomElement } from "../../nodes/isCustomElement";

describe("isCustomElement", () => {
    test("if element is custom", () => {
        const element = document.createElement("custom-element");

        expect(isCustomElement(element)).toBe(true);
    });

    test("if element is not custom", () => {
        const element = document.createElement("div");

        expect(isCustomElement(element)).toBe(false);
    });
});
