import { getByText, waitFor } from "@testing-library/dom";
// adds special assertions like toHaveTextContent
import "@testing-library/jest-dom";
import { Cog } from "../cog";

function getExampleDOM() {
    const div = document.createElement("div");
    div.innerHTML = `
    <div id="app">
    <div>My App</div>
    <div>Counter: {{ counter }}</div>
    <button data-on:click="increment()">Increment</button>
    </div>`;
    const button = div.querySelector("button");

    return div;
}

describe("variable", () => {
    let container;
    let variable;

    beforeEach(() => {
        container = getExampleDOM();
        document.body.appendChild(container);
        variable = Cog().variable;
    });

    afterEach(() => {
        document.body.removeChild(container);
        variable = null;
    });

    function dispatchDOMContentLoaded() {
        const event = new Event("DOMContentLoaded", {
            bubbles: true,
            cancelable: false,
        });
        document.dispatchEvent(event);
    }

    test("Variable initialization", async () => {
        variable("counter", 0);
        dispatchDOMContentLoaded();

        await waitFor(() => {
            expect(getByText(container, /Counter: 0/)).toBeInTheDocument();
        });
    });

    test("Variable update", async () => {
        variable("counter", 1);
        dispatchDOMContentLoaded();

        await waitFor(() => {
            expect(getByText(container, /Counter: 1/)).toBeInTheDocument();
        });
    });
});
