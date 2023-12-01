import "@testing-library/jest-dom";
import { renderTemplates } from "../util/renderTemplates";
import { getByText, waitFor } from "@testing-library/dom";

describe("render", () => {
    test("renders a HTML with a single expression", async () => {
        const element = document.createElement("div");
        element.innerHTML = "<div>Hello {{ name }}!</div>";
        const template = element.outerHTML;
        const tree = [
            {
                element,
                template,
                parentAttributes: [],
            },
        ];

        renderTemplates(tree, { name: "John" });

        await waitFor(() => {
            expect(getByText(element, "Hello John!")).toBeTruthy();
        });
    });
});
