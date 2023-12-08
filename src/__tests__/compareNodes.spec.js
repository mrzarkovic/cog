import "@testing-library/jest-dom";

import { compareTextNodes, compareChildNodes } from "../nodes/compareNodes";

describe("compareNodes", () => {
    beforeEach(() => {});

    afterEach(() => {});

    test("compare two same text nodes", () => {
        const node1 = document.createTextNode("Hello");
        const node2 = document.createTextNode("Hello");

        const comparison = compareTextNodes(node1, node2);

        expect(comparison).toStrictEqual([]);
    });

    test("compare elements with different child nodes", () => {
        const node1 = document.createElement("div");
        const node2 = document.createElement("div");
        node1.innerHTML = "<p>Hello</p>";
        node2.innerHTML = "<p>Hello</p><p>World</p>";

        const comparison = compareChildNodes(node1, node2);

        expect(comparison).toStrictEqual([
            {
                node: node1,
                newNode: node2,
                toBeAdded: ["<p>World</p>"],
            },
        ]);
    });
});
