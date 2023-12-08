import { variable, render } from "../../src/cog";

document.addEventListener("DOMContentLoaded", function () {
    render(document.getElementById("app")!);
});

const checked = variable("checked", false);

window.toggleChecked = () => {
    checked.value = !checked.value;
};
