import "@testing-library/jest-dom";

import { registerTemplates } from "../../nodes/registerTemplates";
import { createReactiveNodes } from "../../createReactiveNodes";
import { createState } from "../../createState";

describe("registerTemplates", () => {
    test("add custom elements to list", () => {
        const root = document.createElement("div");
        const template = document.createElement("template");
        template.setAttribute("id", "my-element");
        template.innerHTML = "<div>{{ dataName }}</div>";
        const customElement = document.createElement("my-element");
        customElement.setAttribute("data-name", "John");
        root.appendChild(template);
        root.appendChild(customElement);
        document.body.appendChild(root);
        const reactiveNodes = createReactiveNodes();
        const state = createState();

        registerTemplates(root, state, reactiveNodes);

        expect(reactiveNodes.list.length).toBe(2);
    });

    test("template should have a single child", () => {
        const root = document.createElement("div");
        const template = document.createElement("template");
        template.setAttribute("id", "my-element2");
        template.innerHTML =
            "<div>{{ dataName }}</div><div>{{ dataName }}</div>";
        const customElement = document.createElement("my-element2");
        customElement.setAttribute("data-name", "John");
        root.appendChild(template);
        root.appendChild(customElement);
        document.body.appendChild(root);
        const reactiveNodes = createReactiveNodes();

        expect(() => {
            const state = createState();
            registerTemplates(root, state, reactiveNodes);
        }).toThrowError(
            "Template my-element2 should have a single HTML Element child"
        );
    });
});
