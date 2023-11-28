import { variable } from "../../src/cog";

variable("foo", "bar");

variable("myValue", "My Attribute");

const count = variable("count", 0);
window.increment = () => {
    count.value++;
};

variable("names", ["Alice", "Bob", "Carol"]);
