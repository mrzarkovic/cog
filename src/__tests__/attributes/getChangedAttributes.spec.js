import "@testing-library/jest-dom";
import { getChangedAttributes } from "../../attributes/getChangedAttributes";

describe("getChangedAttributes", () => {
    test("get changed attributes", () => {
        const oldHtmlElement = document.createElement("div");
        oldHtmlElement.setAttribute("data-id", "0");
        oldHtmlElement.setAttribute("data-name", "Mike");

        const newHtmlElement = document.createElement("div");
        newHtmlElement.setAttribute("data-id", "1");
        newHtmlElement.setAttribute("data-name", "John");

        const changedAttributes = getChangedAttributes(
            oldHtmlElement,
            newHtmlElement
        );

        expect(changedAttributes).toStrictEqual([
            {
                name: "data-id",
                newValue: 1,
            },
            {
                name: "data-name",
                newValue: "John",
            },
        ]);
    });
});
