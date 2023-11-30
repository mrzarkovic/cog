import "@testing-library/jest-dom";
import { renderTemplates } from "../util/renderTemplates";
import { getByText, waitFor } from "@testing-library/dom";

describe("render", () => {
    test("renders a template with a single expression", async () => {
        const element = document.createElement("div");
        element.innerHTML = "<div>Hello {{ name }}!</div>";
        const template = element.innerHTML;
        const tree = [
            {
                element,
                template,
                attributes: [],
                parentAttributes: [],
            },
        ];

        renderTemplates(tree, { name: "John" });

        await waitFor(() => {
            expect(getByText(element, "Hello John!")).toBeTruthy();
        });
    });
});
