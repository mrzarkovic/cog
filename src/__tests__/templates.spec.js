import "@testing-library/jest-dom";
import { loadTemplates } from "../util/loadTemplates";

describe("templates", () => {
    test("load templates", () => {
        const element = document.createElement("div");
        element.innerHTML =
            "<template id='my-template'>Hello {{ name }}!</template><template id='my-other-template'>Hello!</template>";
        const templates = loadTemplates(element);

        expect(templates).toEqual([
            element.querySelector("#my-template"),
            element.querySelector("#my-other-template"),
        ]);
    });
});
