import { variable, render } from "../../src/cog";

document.addEventListener("DOMContentLoaded", function () {
    render(document.getElementById("app")!);
});

const count = variable("count", 0, "my-counter");
variable(
    "increment",
    () => {
        count.value++;
        console.log("my-counter increment", count.value);
    },
    "my-counter"
);
