import { variable, render } from "../../src/cog";

document.addEventListener("DOMContentLoaded", function () {
    render(document.getElementById("app")!);
});

variable("count", 100);
const count = variable("count", 0, "my-counter");
variable("increment", () => count.value++, "my-counter");

variable("isEven", () => count.value % 2 === 0, "my-counter");

// global computed from global state
// variable("isEven", () => globalCount.value % 2 === 0);

// template computed from global state
// variable("isEven", () => globalCount.value % 2 === 0, "my-counter");

// global computed from template state not allowed
// variable("isEven", () => count.value % 2 === 0);
