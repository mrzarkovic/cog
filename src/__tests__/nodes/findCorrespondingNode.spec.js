import "@testing-library/jest-dom";

import { findCorrespondingNode } from "../../nodes/findCorrespondingNode";

describe("findCorrespondingNode", () => {
    test("find node in another tree", () => {
        const element1 = document.createElement("div");
        const child1 = document.createElement("div");
        child1.textContent = "child1";
        element1.appendChild(child1);

        const element2 = document.createElement("div");
        const child2 = document.createElement("div");
        child2.textContent = "child2";
        element2.appendChild(child2);

        const correspondingNode = findCorrespondingNode(
            child1,
            element1,
            element2
        );

        expect(correspondingNode).toBe(child2);
    });

    test("can't find node in another tree", () => {
        const element1 = document.createElement("div");
        const child1 = document.createElement("div");
        child1.textContent = "child1";
        const child2 = document.createElement("div");
        child2.textContent = "child2";
        element1.appendChild(child1);
        element1.appendChild(child2);

        const element2 = document.createElement("div");

        const child3 = document.createElement("div");
        child3.textContent = "child3";
        element2.appendChild(child3);

        const correspondingNode = findCorrespondingNode(
            child2,
            element1,
            element2
        );

        expect(correspondingNode).toBe(null);
    });
});
