import "@testing-library/jest-dom";
import { getAttributesRecursive } from "../../attributes/getAttributesRecursive";

describe("getAttributesRecursive", () => {
    test("add parent attributes to attributes", () => {
        const reactiveNodes = [
            {
                id: 0,
                parentId: null,
                attributes: [
                    {
                        name: "data-parent",
                        value: "parent",
                    },
                ],
            },
            {
                id: 1,
                parentId: 0,
                attributes: [
                    {
                        name: "data-parent2",
                        value: "parent2",
                    },
                ],
            },
            {
                id: 2,
                parentId: null,
                attributes: [
                    {
                        name: "data-parent3",
                        value: "parent3",
                    },
                ],
            },
        ];

        const childAttributes = [
            {
                name: "data-child",
                value: "child",
            },
        ];

        const attributes = getAttributesRecursive(
            1,
            childAttributes,
            reactiveNodes
        );

        expect(attributes).toStrictEqual([
            {
                name: "data-parent",
                value: "parent",
            },
            {
                name: "data-parent2",
                value: "parent2",
            },
            {
                name: "data-child",
                value: "child",
            },
        ]);
    });
});
