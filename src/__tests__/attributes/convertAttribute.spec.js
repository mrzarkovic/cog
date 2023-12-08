import "@testing-library/jest-dom";
import { convertAttribute } from "../../attributes/convertAttribute";

describe("convertAttribute", () => {
    test("convert attribute name to state name", () => {
        const attribute = "data-test";
        const stateVariable = convertAttribute(attribute);

        expect(stateVariable).toEqual("dataTest");
    });
});
