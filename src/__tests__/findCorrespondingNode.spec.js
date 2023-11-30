import "@testing-library/jest-dom";

import { findCorrespondingNode } from "../util/helpers/findCorrespondingNode";

describe("findCorrespondingNode", () => {
    beforeEach(() => {});

    afterEach(() => {});

    test("return null if node not found", () => {
        const div1 = document.createElement("div");
        const div2 = document.createElement("div");
        const target = document.createElement("div");
        div1.appendChild(target);
        const result = findCorrespondingNode(target, div1, div2);

        expect(result).toBe(null);
    });
});
