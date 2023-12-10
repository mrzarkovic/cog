import "@testing-library/jest-dom";
import { sanitizeHtml } from "../../html/sanitizeHtml";

describe("sanitizeHtml", () => {
    test("remove empty lines and line breaks from string", () => {
        const template = `
            <div>
                        
                <p>test</p>
                <p>test</p>
                </div>
            `;
        const result = sanitizeHtml(template);

        expect(result).toEqual("<div><p>test</p><p>test</p></div>");
    });
});
