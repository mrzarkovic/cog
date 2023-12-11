import "@testing-library/jest-dom";
import { handleBooleanAttribute } from "../../attributes/handleBooleanAttribute";

describe("handleBooleanAttribute", () => {
    test("set element checked state to true", () => {
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.checked = false;

        handleBooleanAttribute(checkbox, {
            name: "data-attribute-checked",
            newValue: true,
        });

        expect(checkbox).toBeChecked();
    });

    test("set element checked state to false", () => {
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("checked", "");
        checkbox.checked = true;

        handleBooleanAttribute(checkbox, {
            name: "data-attribute-checked",
            newValue: false,
        });

        expect(checkbox).not.toBeChecked();
    });
});
