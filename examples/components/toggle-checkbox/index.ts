import { variable, component } from "../../../src/cog";

component("toggle-checkbox");

const checked = variable("checked", true);

variable("toggleChecked", () => {
    checked.value = !checked.value;
});
