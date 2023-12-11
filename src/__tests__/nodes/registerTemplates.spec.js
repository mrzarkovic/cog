import "@testing-library/jest-dom";

import { registerTemplates } from "../../nodes/registerTemplates";
import { createReactiveNodes } from "../../createReactiveNodes";

describe("registerTemplates", () => {
    test("add custom elements to list", () => {
        const root = document.createElement("div");
        const template = document.createElement("template");
        template.setAttribute("id", "my-element");
        template.innerHTML = "{{ dataName }}";
        const customElement = document.createElement("my-element");
        customElement.setAttribute("data-name", "John");
        root.appendChild(template);
        root.appendChild(customElement);
        document.body.appendChild(root);
        const reactiveNodes = createReactiveNodes();

        registerTemplates(root, {}, reactiveNodes);

        expect(reactiveNodes.list.length).toBe(1);
    });

    test("template should have a single child", () => {
        const root = document.createElement("div");
        const template = document.createElement("template");
        template.setAttribute("id", "my-element");
        template.innerHTML =
            "<div>{{ dataName }}</div><div>{{ dataName }}</div>";
        const customElement = document.createElement("my-element");
        customElement.setAttribute("data-name", "John");
        root.appendChild(template);
        root.appendChild(customElement);
        document.body.appendChild(root);
        const reactiveNodes = createReactiveNodes();

        expect(() => {
            registerTemplates(root, {}, reactiveNodes);
        }).toThrowError("Template my-element should have a single child");
    });
});