import "@testing-library/jest-dom";

import {
    compareTextNodes,
    compareChildNodes,
    compareCustomElementChildren,
    compareNodes,
} from "../../nodes/compareNodes";

describe("compareNodes", () => {
    test("compareTextNodes are different", () => {
        const element1 = document.createElement("div");
        element1.textContent = "test";
        const element2 = document.createElement("div");
        element2.textContent = "test2";
        const changes = compareTextNodes(element1, element2);

        expect(changes).toEqual([
            {
                node: element2,
                content: "test2",
            },
        ]);
    });

    test("compareTextNodes are the same", () => {
        const element1 = document.createElement("div");
        element1.textContent = "test";
        const element2 = document.createElement("div");
        element2.textContent = "test";
        const changes = compareTextNodes(element1, element2);

        expect(changes).toEqual([]);
    });

    test("compareChildNodes elements to be added", () => {
        const element1 = document.createElement("div");
        const child1 = document.createElement("div");
        child1.textContent = "child1";

        const element2 = document.createElement("div");
        const child2 = document.createElement("div");
        child2.textContent = "child2";
        const child3 = document.createElement("div");
        child3.textContent = "child3";

        element1.appendChild(child1);
        element2.appendChild(child1.cloneNode(true));
        element2.appendChild(child2);
        element2.appendChild(child3);
        const changes = compareChildNodes(element1, element2);

        expect(changes).toEqual([
            {
                node: element2,
                toBeAdded: [child2, child3],
            },
        ]);
    });

    test("compareChildNodes elements to be removed", () => {
        const element1 = document.createElement("div");
        const child1 = document.createElement("div");
        child1.textContent = "child1";
        const child2 = document.createElement("div");
        child2.textContent = "child2";
        const child3 = document.createElement("div");
        child3.textContent = "child3";

        const element2 = document.createElement("div");
        element1.appendChild(child1);
        element1.appendChild(child2);
        element1.appendChild(child3);
        element2.appendChild(child1.cloneNode(true));
        const changes = compareChildNodes(element1, element2);

        expect(changes).toEqual([
            {
                node: element2,
                toBeRemoved: [child2, child3],
            },
        ]);
    });

    test("compareCustomElementChildren are different", () => {
        const oldElement = document.createElement("div");
        oldElement.innerHTML = "<div>test</div>";
        const newElement = document.createElement("div");
        newElement.innerHTML = "<div>test2</div>";

        const changes = compareCustomElementChildren(oldElement, newElement);
        expect(changes).toEqual([
            {
                node: newElement,
                content: "<div>test2</div>",
            },
        ]);
    });

    test("compareCustomElementChildren are the same", () => {
        const oldElement = document.createElement("div");
        oldElement.innerHTML = "<div>test</div>";
        const newElement = document.createElement("div");
        newElement.innerHTML = "<div>test</div>";

        const changes = compareCustomElementChildren(oldElement, newElement);
        expect(changes).toStrictEqual([]);
    });

    test("compareNodes attributes are different", () => {
        const oldElement = document.createElement("div");
        oldElement.setAttribute("class", "test");
        const newElement = document.createElement("div");
        newElement.setAttribute("class", "test2");

        const changes = compareNodes(oldElement, newElement);
        expect(changes).toEqual([
            {
                node: newElement,
                attributes: [
                    {
                        name: "class",
                        newValue: "test2",
                    },
                ],
            },
        ]);
    });

    test("compareNodes custom elements are different", () => {
        const oldElement = document.createElement("my-div");
        const child1 = document.createElement("div");
        child1.textContent = "test";
        oldElement.appendChild(child1);
        const newElement = document.createElement("my-div");
        const child2 = document.createElement("div");
        child2.textContent = "test2";
        newElement.appendChild(child2);

        const changes = compareNodes(oldElement, newElement);
        expect(changes).toEqual([
            {
                node: newElement,
                content: newElement.innerHTML,
            },
        ]);
    });

    test("compareNodes children are different", () => {
        const oldElement = document.createElement("div");
        const child1 = document.createElement("div");
        child1.textContent = "test";
        oldElement.appendChild(child1);
        const newElement = document.createElement("div");
        const child2 = document.createElement("div");
        child2.textContent = "test2";
        newElement.appendChild(child2);

        const changes = compareNodes(oldElement, newElement);
        expect(changes).toEqual([
            {
                node: child2,
                content: child2.textContent,
            },
        ]);
    });
});
