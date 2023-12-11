import "@testing-library/jest-dom";

import { htmlToText } from "../../html/htmlToText";

describe("htmlToText", () => {
    test("transform html to text", () => {
        const template = "<div>{{ 3 &gt; 2 }}</div>";
        const result = htmlToText(template);

        expect(result).toEqual("<div>{{ 3 > 2 }}</div>");
    });
});
