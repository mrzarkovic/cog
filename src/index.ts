import { variable } from "./Cog";

const counter = variable("counter", 0);

variable("increment", () => {
    counter.set(counter.value + 1);
});
