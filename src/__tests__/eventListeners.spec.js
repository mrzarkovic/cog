import "@testing-library/jest-dom";
import { addEventListeners } from "../util/eventListeners/addEventListeners";
import { removeEventListeners } from "../util/eventListeners/removeEventListeners";
import { getByText } from "@testing-library/dom";

const getWindowErrorPromise = () =>
    new Promise((resolve, reject) => {
        window.addEventListener("error", (event) => {
            event.preventDefault();
            reject(event.error);
        });
    });

describe("eventListeners", () => {
    test("add/remove event listeners from elements", () => {
        const parent = document.createElement("div");
        parent.innerHTML = "<button data-on-click='mock()'>Click</button>";
        const button = getByText(parent, "Click");

        const mock = jest.fn();
        const state = { mock };

        addEventListeners(parent, "click", state);
        button.click();

        expect(mock).toHaveBeenCalled();

        removeEventListeners(parent, "click");
        button.click();

        expect(mock).toHaveBeenCalledTimes(1);
    });

    test("handle event listeners that reference undefined variables", () => {
        const parent = document.createElement("div");
        parent.innerHTML = "<button data-on-click='mock()'>Click</button>";
        const button = getByText(parent, "Click");
        const state = {};
        addEventListeners(parent, "click", state);

        const errorPromise = getWindowErrorPromise();
        button.click();

        expect(errorPromise).rejects.toThrow();
    });

    test("handle no handler attribute", () => {
        const parent = document.createElement("div");
        parent.innerHTML = "<button data-on-click>Click</button>";
        const state = {};
        expect(() => addEventListeners(parent, "click", state)).toThrow();
    });
});
