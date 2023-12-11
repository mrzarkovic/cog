import "@testing-library/jest-dom";
import { removeTagsAndAttributeNames } from "../../html/removeTagsAndAttributeNames";

describe("removeTagsAndAttributeNames", () => {
    test("remove tags, attribute names and special chars from string", () => {
        const template =
            "<my-component data-attribute='{{ true }}'>{{ isTrue() ? true : false }}</my-component>";
        const result = removeTagsAndAttributeNames(template);

        expect(result).toEqual(" true isTrue() true false ");
    });
});
