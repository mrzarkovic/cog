import { variable, render } from "../../src/cog";

document.addEventListener("DOMContentLoaded", function () {
    render(document.getElementById("app")!);
});

function generateRandomString() {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const charactersLength = characters.length;

    for (let i = 0; i < 5; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }

    return result;
}

variable("count", 100);
const count = variable("count", 0, "my-counter");
const names = variable("names", ["Alice", "Bob", "Carol"], "my-counter");
variable(
    "increment",
    () => {
        names.value.push(generateRandomString());
    },
    "my-counter"
);

variable("isEven", () => count.value % 2 === 0, "my-counter");

// global computed from global state
// variable("isEven", () => globalCount.value % 2 === 0);

// template computed from global state
// variable("isEven", () => globalCount.value % 2 === 0, "my-counter");

// global computed from template state not allowed
// variable("isEven", () => count.value % 2 === 0);
