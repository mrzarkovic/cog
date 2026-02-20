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
                "Template my-template3 should have a single child",
            );
        });
    });

    test("update custom element reactive data attribute", async () => {
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

    test("update custom element static data attribute", async () => {
        const root = document.createElement("div");
        const template = document.createElement("template");
        template.id = "my-template5";
        template.innerHTML = "<div>Hello {{ dataChild }}!</div>";
        const container = document.createElement("div");
        container.innerHTML =
            '{{ new Array(1).fill(0).map( (n, i) => `<my-template5 data-child="${i + count}"></my-template5>`)}}';
        root.appendChild(template);
        root.appendChild(container);
        document.body.appendChild(root);
        const cog = init();
        const count = cog.variable("count", 0);
        cog.render(root);

        const element = getByText(root, "Hello 0!");

        expect(element).toBeInTheDocument();

        count.value = 1;

        await waitFor(() => {
            expect(element.textContent).toBe("Hello 1!");
        });
    });

    test("update custom element children attribute", async () => {
        const root = document.createElement("div");
        const template = document.createElement("template");
        template.id = "my-template6";
        template.innerHTML = "<div>Hello {{ children }}!</div>";
        const container = document.createElement("div");
        container.innerHTML =
            "{{ new Array(1).fill(0).map( (n, i) => `<my-template6>${i + count}</my-template6>`)}}";
        root.appendChild(template);
        root.appendChild(container);
        document.body.appendChild(root);
        const cog = init();
        const count = cog.variable("count", 0);
        cog.render(root);

        const element = getByText(root, "Hello 0!");

        expect(element).toBeInTheDocument();

        count.value = 1;

        await waitFor(() => {
            expect(element.textContent).toBe("Hello 1!");
        });
    });

    test("add children to custom element", async () => {
        const root = document.createElement("div");
        const template = document.createElement("template");
        template.id = "my-template7";
        template.innerHTML = "<div>Hello World!</div>";
        const container = document.createElement("div");
        container.setAttribute("data-testid", "container-add-children");
        container.innerHTML =
            "{{ new Array(count).fill(0).map( (n, i) => `<my-template7></my-template7>`)}}";
        root.appendChild(template);
        root.appendChild(container);
        document.body.appendChild(root);
        const cog = init();
        const count = cog.variable("count", 1);
        cog.render(root);

        count.value = 5;

        await waitFor(() => {
            expect(
                getByTestId(root, "container-add-children").children.length,
            ).toBe(5);
        });
    });

    test("remove children from custom element", async () => {
        const root = document.createElement("div");
        const template = document.createElement("template");
        template.id = "my-template8";
        template.innerHTML = "<div>Hello World!</div>";
        const container = document.createElement("div");
        container.setAttribute("data-testid", "container-remove-children");
        container.innerHTML =
            "{{ new Array(count).fill(0).map( (n, i) => `<my-template8></my-template8>`)}}";
        root.appendChild(template);
        root.appendChild(container);
        document.body.appendChild(root);
        const cog = init();
        const count = cog.variable("count", 3);
        cog.render(root);

        count.value = 1;

        await waitFor(() => {
            expect(
                getByTestId(root, "container-remove-children").children.length,
            ).toBe(1);
        });
    });

    test("update child custom elements of custom element", async () => {
        const root = document.createElement("div");
        const template = document.createElement("template");
        template.id = "my-template10";
        template.innerHTML = "<div>Hello {{dataChild}}!</div>";
        const container = document.createElement("template");
        container.id = "my-template-container";
        container.innerHTML =
            "<div>{{ new Array(1).fill(0).map( (n, i) => `<my-template10 data-child={{dataParent}}></my-template10>`)}}</div>";
        const parent = document.createElement("my-template-container");
        parent.setAttribute("data-parent", "{{name}}");
        root.appendChild(template);
        root.appendChild(container);
        root.appendChild(parent);
        document.body.appendChild(root);

        const cog = init();
        cog.variable("name", "World");
        cog.render(root);

        await waitFor(() => {
            expect(getByText(root, "Hello World!")).toBeInTheDocument();
        });
    });

    test("update prop-drilled children in nested custom element", async () => {
        const root = document.createElement("div");
        const childTemplate = document.createElement("template");
        childTemplate.id = "x-inner";
        childTemplate.innerHTML =
            '<div><span class="label">Inner:</span><span data-testid="inner-content">{{ children }}</span></div>';

        const parentTemplate = document.createElement("template");
        parentTemplate.id = "x-outer";
        parentTemplate.innerHTML =
            "<div><x-inner><span>{{dataValue}}</span></x-inner></div>";

        const usage = document.createElement("x-outer");
        usage.setAttribute("data-value", "{{ count }}");

        root.appendChild(childTemplate);
        root.appendChild(parentTemplate);
        root.appendChild(usage);
        document.body.appendChild(root);

        const cog = init();
        const count = cog.variable("count", 1);
        cog.render(root);

        await waitFor(() => {
            expect(getByTestId(root, "inner-content").textContent).toBe("1");
        });

        count.value = 2;

        await waitFor(() => {
            expect(getByTestId(root, "inner-content").textContent).toBe("2");
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
