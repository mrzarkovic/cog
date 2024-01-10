import { variable, render } from "../../src/cog";

document.addEventListener("DOMContentLoaded", function () {
    render(document.getElementById("app")!);
});

const count = variable("count", 0);
variable("increment", () => {
    count.set(count.value + 1);
});
