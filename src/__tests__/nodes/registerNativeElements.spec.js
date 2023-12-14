import "@testing-library/jest-dom";

import { registerNativeElements } from "../../nodes/registerNativeElements";
import { createReactiveNodes } from "../../createReactiveNodes";

describe("registerNativeElements", () => {
    test("reactive element added to list", () => {
        const root = document.createElement("div");
        const element1 = document.createElement("div");
        element1.textContent = "{{ name }}";
        const element2 = document.createElement("div");
        element2.textContent = "name";
        root.appendChild(element1);
        root.appendChild(element2);
        const reactiveNodes = createReactiveNodes();

        registerNativeElements(
            root,
            { name: { value: "John" } },
            reactiveNodes
        );

        expect(reactiveNodes.list.length).toBe(1);
    });
});
