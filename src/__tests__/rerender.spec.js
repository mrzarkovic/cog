import "@testing-library/jest-dom";
import { init } from "../cog";
import { waitFor } from "@testing-library/dom";
import { reconcile } from "../nodes/reconcile";

jest.mock("../nodes/reconcile", () => ({
    reconcile: jest.fn(),
}));

describe("rerender", () => {
    test("call reconcile only once for batch", async () => {
        const root = document.createElement("div");
        const element = document.createElement("div");
        element.innerHTML = "<div>Hello {{ name }}!</div>";
        root.appendChild(element);
        document.body.appendChild(root);

        const cog = init();
        const name = cog.variable("name", "World");
        cog.render(root);

        name.value = "Me";
        name.value = "Them";
        name.value = "You";

        await waitFor(() => {
            expect(reconcile).toHaveBeenCalledTimes(1);
        });
    });
});
