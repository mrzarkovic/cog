import "@testing-library/jest-dom";
import { init } from "../cog";
import { getByText, getByTestId, waitFor } from "@testing-library/dom";

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

    test("pass data to custom element through data attributes", () => {
        const root = document.createElement("div");
        const template = document.createElement("template");
        template.id = "my-element";
        template.innerHTML = "<div>Hello {{ dataName }}!</div>";
        const myElement = document.createElement("my-element");
        myElement.setAttribute("data-name", "World");
        root.appendChild(template);
        root.appendChild(myElement);
        document.body.appendChild(root);

        const cog = init();
        cog.render(root);

        expect(getByText(root, "Hello World!")).toBeInTheDocument();
    });

    test("template should have a single child", async () => {
        const root = document.createElement("div");
        const template = document.createElement("template");
        template.id = "my-template3";
        const element = document.createElement("div");
        template.appendChild(element);
        template.appendChild(element.cloneNode(true));

        document.body.appendChild(element);

        const cog = init();
        cog.render(root);

        const errorPromise = getWindowErrorPromise();

        await waitFor(() => {
            expect(errorPromise).rejects.toThrow(
                "Template my-template3 should have a single child"
            );
        });
    });

    test("update custom element data attribute", async () => {
        const root = document.createElement("div");
        const template = document.createElement("template");
        template.id = "my-template4";
        template.innerHTML = "<div>Hello {{ dataName }}!</div>";
        const myElement = document.createElement("my-template4");
        myElement.setAttribute("data-name", "{{ name }}");
        root.appendChild(template);
        root.appendChild(myElement);
        document.body.appendChild(root);
        const cog = init();
        const name = cog.variable("name", "World");

        cog.render(root);

        const element = getByText(root, "Hello World!");

        expect(element).toBeInTheDocument();

        name.value = "Me";

        await waitFor(() => {
            expect(element.textContent).toBe("Hello Me!");
        });
    });

    test("update variable, method invocation", async () => {
        const root = document.createElement("div");
        const element = document.createElement("div");
        element.textContent = "Hello {{ name }}!";
        root.appendChild(element);
        document.body.appendChild(root);

        const cog = init();
        const name = cog.variable("name", "John");

        cog.render(root);

        name.set("Jane");

        await waitFor(() => {
            expect(getByText(root, "Hello Jane!")).toBeInTheDocument();
        });
    });

    test("read variable", () => {
        const cog = init();
        const name = cog.variable("name", "John");

        expect(name.value).toEqual("John");
    });

    test("conditional attribute true", async () => {
        const root = document.createElement("div");
        const element = document.createElement("input");
        element.setAttribute("type", "checkbox");
        element.setAttribute("data-attribute-checked", "{{ checked }}");
        element.setAttribute("data-testid", "checkbox");
        root.appendChild(element);
        document.body.appendChild(root);
        const cog = init();
        cog.variable("checked", true);
        cog.render(root);

        await waitFor(() => {
            expect(getByTestId(root, "checkbox")).toBeChecked();
        });
    });

    test("conditional attribute false", async () => {
        const root = document.createElement("div");
        const element = document.createElement("input");
        element.setAttribute("type", "checkbox");
        element.setAttribute("data-attribute-checked", "{{ checked }}");
        element.setAttribute("checked", true);
        element.checked = true;
        element.setAttribute("data-testid", "checkbox");
        root.appendChild(element);
        document.body.appendChild(root);
        const cog = init();
        cog.variable("checked", false);
        cog.render(root);

        await waitFor(() => {
            expect(getByTestId(root, "checkbox")).not.toBeChecked();
        });
    });
});
