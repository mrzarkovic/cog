import { variable, component } from "../../../src/cog";
import { count, names } from "../../state";

component("count-control");

variable("increment", () => {
    count.value++;
    names.value.push(generateRandomString());
});

variable("decrement", () => {
    count.value--;
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
