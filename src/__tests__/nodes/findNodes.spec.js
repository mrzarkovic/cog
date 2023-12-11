import "@testing-library/jest-dom";

import { findNodes } from "../../nodes/findNodes";

describe("findNodes", () => {
    test("find nodes with xpath query", () => {
        const element1 = document.createElement("div");
        const child1 = document.createElement("template");
        const child2 = document.createElement("div");
        const child3 = document.createElement("div");
        element1.appendChild(child1);
        element1.appendChild(child2);
        element1.appendChild(child3);

        const nodes = findNodes(element1, ".//div", () => true);

        expect(nodes).toEqual([child2, child3]);
    });
});
