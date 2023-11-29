import { variable } from "../../src/cog";

variable("names", ["Alice", "Bob", "Carol"]);
const count = variable("count", 0);

window.increment = () => {
    count.value++;
};
