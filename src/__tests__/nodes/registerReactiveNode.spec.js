import "@testing-library/jest-dom";

import { registerReactiveNode } from "../../nodes/registerReactiveNode";
import { createReactiveNodes } from "../../createReactiveNodes";

describe("registerReactiveNode", () => {
    test("element added to list and new element created", () => {
        const root = document.createElement("div");
        const element1 = document.createElement("div");
        element1.textContent = "{{ name }}";
        const element2 = document.createElement("div");
        element2.textContent = "name";
        root.appendChild(element1);
        root.appendChild(element2);
        const reactiveNodes = createReactiveNodes();

        const newElement = registerReactiveNode(
            1,
            reactiveNodes,
            element1,
            element1.outerHTML,
            {
                name: {
                    value: "John",
                },
            },
            [],
            null
        );

        expect(newElement.textContent).toBe("John");
    });
});
