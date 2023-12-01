import "@testing-library/jest-dom";
import { reconcile } from "../util/reconcile";
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

        reconcile(tree, { name: "John" });

        await waitFor(() => {
            expect(getByText(element, "Hello John!")).toBeTruthy();
        });
    });
});
