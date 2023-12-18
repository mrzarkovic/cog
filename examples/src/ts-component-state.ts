import { variable, render } from "../../src/cog";

document.addEventListener("DOMContentLoaded", function () {
    render(document.getElementById("app")!);
});

variable("count", 100);
const count = variable("count", 0, "my-counter");
variable("increment", () => count.value++, "my-counter");
