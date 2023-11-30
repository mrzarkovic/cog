import "@testing-library/jest-dom";
import { init } from "../cog";
import { getByText, waitFor } from "@testing-library/dom";

const getWindowErrorPromise = () =>
    new Promise((resolve, reject) => {
        window.addEventListener("error", (event) => {
            event.preventDefault();
            reject(event.error);
        });
    });

describe("cog", () => {
    function dispatchDOMContentLoaded() {
        const event = new Event("DOMContentLoaded", {
            bubbles: true,
            cancelable: false,
        });
        document.dispatchEvent(event);
    }

    afterEach(() => {
        document.body.innerHTML = "";
    });

    test("template with no id to throw", () => {
        const element = document.createElement("div");
        element.innerHTML =
            "<div id='app'><template>Hello {{ name }}!</template></div>";
        document.body.appendChild(element);
        init(document);
        const errorPromise = getWindowErrorPromise();

        dispatchDOMContentLoaded();

        expect(errorPromise).rejects.toThrow("Missing id attribute");
    });

    test("template props", async () => {
        const element = document.createElement("div");
        const template =
            "<template id='my-template'>Hello {{ dataName }}!</template>";
        const html = "<div><my-template data-name='World'></my-template></div>";
        element.innerHTML = "<div id='app'>" + template + html + "</div>";
        document.body.appendChild(element);
        init(document);
        dispatchDOMContentLoaded();

        await waitFor(() => {
            expect(getByText(element, "Hello World!")).toBeInTheDocument();
        });
    });

    test("fail if no #app element", () => {
        init(document);
        const errorPromise = getWindowErrorPromise();
        dispatchDOMContentLoaded();

        expect(errorPromise).rejects.toThrow("No app element found!");
    });

    test("render with #app element", () => {
        const element = document.createElement("div");
        element.innerHTML = "<div id='app'></div>";
        document.body.appendChild(element);

        init(document);

        dispatchDOMContentLoaded();

        expect(element.innerHTML).toEqual('<div id="app"></div>');
    });

    test("use variable in HTML", async () => {
        const element = document.createElement("div");
        element.innerHTML = "<div id='app'><div>Hello {{ name }}!</div></div>";
        document.body.appendChild(element);

        const variable = init(document).variable;
        variable("name", "John");

        dispatchDOMContentLoaded();

        await waitFor(() => {
            expect(getByText(element, "Hello John!")).toBeInTheDocument();
        });
    });

    test("update variable, direct assignment", async () => {
        const variable = init(document).variable;
        const name = variable("name", "John");

        name.value = "Jane";

        await waitFor(() => {
            expect(name.value).toEqual("Jane");
        });
    });

    test("update variable, method invocation", async () => {
        const variable = init(document).variable;
        const name = variable("name", "John");

        name.set("Jane");

        await waitFor(() => {
            expect(name.value).toEqual("Jane");
        });
    });

    test("read variable", () => {
        const variable = init(document).variable;
        const name = variable("name", "John");

        expect(name.value).toEqual("John");
    });
});
