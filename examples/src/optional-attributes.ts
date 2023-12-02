import { variable } from "../../src/cog";

const checked = variable("checked", false);

window.toggleChecked = () => {
    checked.value = !checked.value;
};
