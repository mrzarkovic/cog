import { variable, render } from "../../src/cog";

document.addEventListener("DOMContentLoaded", function () {
    render(document.getElementById("app")!);
});

const count = variable("count", 1);

window.increment = () => {
    count.value++;
};
