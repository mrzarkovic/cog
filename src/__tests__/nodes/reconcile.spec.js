import "@testing-library/jest-dom";

import { reconcile } from "../../nodes/reconcile";
import { createReactiveNodes } from "../../createReactiveNodes";
import { registerNativeElements } from "../../nodes/registerNativeElements";
import { getByTestId, getByText } from "@testing-library/dom";

describe("reconcile", () => {
    test("update changed elements", () => {
        const root = document.createElement("div");
        const element1 = document.createElement("div");
        element1.textContent = "{{ name }}";
        const element2 = document.createElement("div");
        element2.textContent = "name";
        root.appendChild(element1);
        root.appendChild(element2);
        document.body.appendChild(root);
        const reactiveNodes = createReactiveNodes();

        registerNativeElements(
            root,
            {
                name: {
                    value: "John",
                    dependents: [],
                    dependencies: [],
                },
            },
            reactiveNodes
        );

        reconcile(
            reactiveNodes,
            reactiveNodes.list,
            {
                name: {
                    value: "Mike",
                    dependents: [],
                    dependencies: [],
                },
            },
            ["name"]
        );

        expect(getByText(root, "Mike")).toBeInTheDocument();
    });

    test("update attribute", () => {
        const root = document.createElement("div");
        const element1 = document.createElement("div");
        element1.textContent = "Hello";
        element1.setAttribute("data-attribute-checked", "{{ checked }}");
        element1.setAttribute("data-testid", "checkbox");
        root.appendChild(element1);
        document.body.appendChild(root);

        const reactiveNodes = createReactiveNodes();

        registerNativeElements(
            root,
            { checked: { value: "false", dependents: [], dependencies: [] } },
            reactiveNodes
        );

        reconcile(
            reactiveNodes,
            reactiveNodes.list,
            {
                checked: {
                    value: true,
                    dependents: [],
                    dependencies: [],
                },
            },
            ["checked"]
        );

        expect(
            getByTestId(root, "checkbox").getAttribute("data-attribute-checked")
        ).toBe("true");
    });
});
