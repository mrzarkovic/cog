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
        const state = { global: 1 };
        const localState = attributesToState(attributes, state);

        expect(localState).toEqual({ global: 1, dataTest: "test" });
    });
});
