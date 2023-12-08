import "@testing-library/jest-dom";
import { registerNativeElements } from "../nodes/loadNativeElements";
import { createNativeElements } from "../nativeElements";

describe("registerNativeElements", () => {
    test("load a list of native elements with templates", () => {
        const element = document.createElement("div");
        element.innerHTML = `<div>
            <div id='first'>first {{ expression }}</div>
            <div>
                <div id='second'>second {{ expression }}</div>
            </div>
            <div id='third'>third {{ expression }}</div>
        </div>`;

        const nativeElements = createNativeElements();
        registerNativeElements(
            element,
            { expression: "hello" },
            nativeElements
        );

        expect(nativeElements.value).toEqual([
            {
                element: element.querySelector("#first"),
                template: '<div id="first">first {{ expression }}</div>',
                lastTemplateEvaluation: '<div id="first">first hello</div>',
                parentAttributes: [],
            },
            {
                element: element.querySelector("#second"),
                template: '<div id="second">second {{ expression }}</div>',
                lastTemplateEvaluation: '<div id="second">second hello</div>',
                parentAttributes: [],
            },
            {
                element: element.querySelector("#third"),
                template: '<div id="third">third {{ expression }}</div>',
                lastTemplateEvaluation: '<div id="third">third hello</div>',
                parentAttributes: [],
            },
        ]);
    });
});
