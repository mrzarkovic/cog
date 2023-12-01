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

    beforeEach(() => {
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
            "<template id='my-template1'>Hello {{ dataName }}!</template>";
        const html =
            "<div><my-template1 data-name='World'></my-template1></div>";
        element.innerHTML = "<div id='app'>" + template + html + "</div>";
        document.body.appendChild(element);
        init(document);
        dispatchDOMContentLoaded();

        await waitFor(() => {
            expect(getByText(element, "Hello World!")).toBeInTheDocument();
        });
    });

    test("template root attributes", async () => {
        const element = document.createElement("div");
        const template =
            "<template id='my-template2'><span id='{{ dataName }}'>Hello Span!</span></template>";
        const html =
            "<div><my-template2 data-name='World'></my-template2></div>";
        element.innerHTML = "<div id='app'>" + template + html + "</div>";
        document.body.appendChild(element);
        init(document);
        dispatchDOMContentLoaded();

        await waitFor(() => {
            expect(element.querySelector("#World")).toBeInTheDocument();
        });
    });

    test("template should have a single child", async () => {
        const element = document.createElement("div");
        element.innerHTML =
            "<div id='app'><template id='my-template3'><div></div><div></div></template></div>";
        document.body.appendChild(element);
        init(document);

        const errorPromise = getWindowErrorPromise();

        dispatchDOMContentLoaded();

        await waitFor(() => {
            expect(errorPromise).rejects.toThrow(
                "Template my-template3 should have a single child"
            );
        });
    });

    test("update template root attributes", async () => {
        const element = document.createElement("div");
        const template =
            "<template id='my-template4'><span id='{{ dataName }}'>Hello Span!</span></template>";
        const html =
            "<div><my-template4 data-name='{{ name }}'></my-template4></div>";
        element.innerHTML = "<div id='app'>" + template + html + "</div>";
        document.body.appendChild(element);
        const variable = init(document).variable;

        const name = variable("name", "first");

        dispatchDOMContentLoaded();

        name.value = "second";

        await waitFor(() => {
            expect(element.querySelector("#second")).toBeInTheDocument();
        });
    });

    test("custom child element changed", async () => {
        const element = document.createElement("div");
        const childTemplate =
            "<template id='my-child1'><div>{{ dataChild }}</div></template>";
        const parentTemplate =
            "<template id='my-template5'><div><my-child1 data-child='{{ dataName }}'></my-child1></div></template>";
        const html =
            "<div><my-template5 data-name='{{ name }}'></my-template5></div>";
        element.innerHTML =
            "<div id='app'>" + childTemplate + parentTemplate + html + "</div>";
        document.body.appendChild(element);
        const variable = init(document).variable;

        const name = variable("name", "first");

        dispatchDOMContentLoaded();

        name.value = "second";

        await waitFor(() => {
            expect(getByText(element, "second")).toBeInTheDocument();
        });
    });

    test("text node changed", async () => {
        const element = document.createElement("div");
        const template =
            "<template id='my-template6'>{{ dataName }}</template>";
        const html = "<my-template6 data-name='{{ name }}'></my-template6>";
        element.innerHTML = "<div id='app'>" + template + html + "</div>";
        document.body.appendChild(element);
        const variable = init(document).variable;

        const name = variable("name", "first");

        dispatchDOMContentLoaded();

        name.value = "second";

        await waitFor(() => {
            expect(getByText(element, "second")).toBeInTheDocument();
        });
    });

    test("child attributes changed", async () => {
        const element = document.createElement("div");
        const template =
            "<template id='my-template7'><div><span id='{{ dataName }}'>Name</span></div></template>";
        const html = "<my-template7 data-name='{{ name }}'></my-template7>";
        element.innerHTML = "<div id='app'>" + template + html + "</div>";
        document.body.appendChild(element);
        const variable = init(document).variable;

        const name = variable("name", "first");

        dispatchDOMContentLoaded();

        name.value = "second";

        await waitFor(() => {
            expect(element.querySelector("#second")).toBeInTheDocument();
        });
    });

    test("child text changed", async () => {
        const element = document.createElement("div");
        const template =
            "<template id='my-template8'><div><span>{{ dataName }}</span></div></template>";
        const html = "<my-template8 data-name='{{ name }}'></my-template8>";
        element.innerHTML = "<div id='app'>" + template + html + "</div>";
        document.body.appendChild(element);
        const variable = init(document).variable;

        const name = variable("name", "first");

        dispatchDOMContentLoaded();

        name.value = "second";

        await waitFor(() => {
            expect(getByText(element, "second")).toBeInTheDocument();
        });
    });

    test("fail if no #app element", async () => {
        init(document);
        const errorPromise = getWindowErrorPromise();
        dispatchDOMContentLoaded();

        await waitFor(() => {
            expect(errorPromise).rejects.toThrow("No app element found!");
        });
    });

    test("render with #app element", async () => {
        const element = document.createElement("div");
        element.innerHTML = "<div id='app'></div>";
        document.body.appendChild(element);

        init(document);

        dispatchDOMContentLoaded();

        await waitFor(() => {
            expect(element.innerHTML).toEqual('<div id="app"></div>');
        });
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
        const element = document.createElement("div");
        element.innerHTML = "<div id='app'><div>Hello {{ name }}!</div></div>";
        document.body.appendChild(element);

        const variable = init(document).variable;
        const name = variable("name", "John");

        dispatchDOMContentLoaded();

        name.value = "Jane";

        await waitFor(() => {
            expect(getByText(element, "Hello Jane!")).toBeInTheDocument();
        });
    });

    test("update variable, method invocation", async () => {
        const element = document.createElement("div");
        element.innerHTML = "<div id='app'><div>Hello {{ name }}!</div></div>";
        document.body.appendChild(element);
        const variable = init(document).variable;
        const name = variable("name", "John");

        dispatchDOMContentLoaded();

        name.set("Jane");

        await waitFor(() => {
            expect(getByText(element, "Hello Jane!")).toBeInTheDocument();
        });
    });

    test("read variable", () => {
        const variable = init(document).variable;
        const name = variable("name", "John");

        expect(name.value).toEqual("John");
    });
});
