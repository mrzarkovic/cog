import "@testing-library/jest-dom";

import { createReactiveNodes } from "../createReactiveNodes";

describe("createReactiveNodes", () => {
    test("createReactiveNodes", () => {
        const reactiveNodes = createReactiveNodes();

        expect(reactiveNodes.lastId).toEqual(0);
    });
});
