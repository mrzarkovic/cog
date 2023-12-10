import "@testing-library/jest-dom";

import { elementFromString } from "../../nodes/elementFromString";

describe("elementFromString", () => {
    test("get element from string", () => {
        const elementString = "<div>test</div>";
        const element = elementFromString(elementString);

        expect(element.outerHTML).toBe(elementString);
        expect(element.textContent).toBe("test");
    });
});
