import "@testing-library/jest-dom";
import { attributesToState } from "../../attributes/attributesToState";

describe("attributesToState", () => {
    test("state created from attributes", () => {
        const attributes = [
            {
                name: "data-test",
                value: "test",
                expressions: [],
                reactive: false,
            },
        ];
        const state = {
            global: {
                value: 1,
                dependents: [],
                computants: [],
            },
        };
        const localState = attributesToState(attributes, state);

        expect(localState).toStrictEqual({
            global: {
                value: 1,
                dependents: [],
                computants: [],
            },
            dataTest: {
                value: "test",
                dependents: [],
                computants: [],
            },
        });
    });
});
