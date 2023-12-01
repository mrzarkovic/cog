import "@testing-library/jest-dom";
import { loadTree } from "../util/loadTree";

describe("loadTree", () => {
    test("load a tree of elements with templates", () => {
        const element = document.createElement("div");
        element.innerHTML = `<div>
            <div id='first'>first {{ expression }}</div>
            <div>
                <div id='second'>second {{ expression }}</div>
            </div>
            <div id='third'>third {{ expression }}</div>
        </div>`;
        const tree = loadTree(element);

        expect(tree).toEqual([
            {
                element: element.querySelector("#first"),
                template: '<div id="first">first {{ expression }}</div>',
                parentAttributes: [],
            },
            {
                element: element.querySelector("#second"),
                template: '<div id="second">second {{ expression }}</div>',
                parentAttributes: [],
            },
            {
                element: element.querySelector("#third"),
                template: '<div id="third">third {{ expression }}</div>',
                parentAttributes: [],
            },
        ]);
    });
});
