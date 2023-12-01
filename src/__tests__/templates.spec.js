import "@testing-library/jest-dom";
import { loadTemplates } from "../util/loadTemplates";

describe("templates", () => {
    test("load templates", () => {
        const element = document.createElement("div");
        const compareElement = document.createElement("div");
        element.innerHTML =
            "<template id='my-template'>Hello {{ name }}!</template><template id='my-other-template'>Hello!</template>";
        compareElement.innerHTML = element.innerHTML;
        const templates = loadTemplates(element);

        expect(templates).toEqual([
            compareElement.querySelector("#my-template"),
            compareElement.querySelector("#my-other-template"),
        ]);
    });
});
