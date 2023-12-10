import "@testing-library/jest-dom";

import { cleanReactiveNodesList } from "../../nodes/cleanReactiveNodesList";

describe("cleanReactiveNodesList", () => {
    test("remove elements not present in DOM from list", () => {
        const element1 = document.createElement("div");
        const element2 = document.createElement("div");

        document.body.appendChild(element1);

        const reactiveNodes = [{ element: element1 }, { element: element2 }];

        const cleanedReactiveNodes = cleanReactiveNodesList(reactiveNodes);

        expect(cleanedReactiveNodes).toEqual([{ element: element1 }]);
    });
});
