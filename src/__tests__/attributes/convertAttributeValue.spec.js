import "@testing-library/jest-dom";
import { convertAttributeValue } from "../../attributes/convertAttributeValue";

describe("convertAttributeValue", () => {
    test("string 'false' becomes boolean false", () => {
        const attributeValue = "false";
        const convertedValue = convertAttributeValue(attributeValue);

        expect(convertedValue).toStrictEqual(false);
    });

    test("string 'true' becomes boolean true", () => {
        const attributeValue = "true";
        const convertedValue = convertAttributeValue(attributeValue);

        expect(convertedValue).toStrictEqual(true);
    });

    test("string 'undefined' becomes undefined", () => {
        const attributeValue = "undefined";
        const convertedValue = convertAttributeValue(attributeValue);

        expect(convertedValue).toStrictEqual(undefined);
    });

    test("string 'null' becomes null", () => {
        const attributeValue = "null";
        const convertedValue = convertAttributeValue(attributeValue);

        expect(convertedValue).toStrictEqual(null);
    });

    test("number as a string becomes a number", () => {
        const attributeValue = "9";
        const convertedValue = convertAttributeValue(attributeValue);

        expect(convertedValue).toStrictEqual(9);
    });

    test("any string remains the same", () => {
        const attributeValue = "same";
        const convertedValue = convertAttributeValue(attributeValue);

        expect(convertedValue).toStrictEqual("same");
    });
});
