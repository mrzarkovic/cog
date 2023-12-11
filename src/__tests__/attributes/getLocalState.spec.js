import "@testing-library/jest-dom";
import { getLocalState } from "../../attributes/getLocalState";

describe("getLocalState", () => {
    test("get local state from attributes", () => {
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
                parentId: 1,
                attributes: [
                    {
                        name: "data-parent3",
                        value: "parent3",
                    },
                ],
            },
        ];
        const elementAttributes = [
            {
                name: "data-child",
                value: "child",
            },
        ];
        const globalState = {
            global: 42,
        };
        const localState = getLocalState(
            2,
            elementAttributes,
            globalState,
            reactiveNodes
        );

        expect(localState).toStrictEqual({
            global: 42,
            dataChild: "child",
            dataParent: "parent",
            dataParent2: "parent2",
            dataParent3: "parent3",
        });
    });
});
