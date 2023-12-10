import "@testing-library/jest-dom";

import { createState } from "../createState";

describe("createState", () => {
    test("createState", () => {
        const stateObject = createState();

        expect(stateObject.state).toEqual(null);
    });
});
