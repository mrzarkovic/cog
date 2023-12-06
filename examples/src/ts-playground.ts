import { variable } from "../../src/cog";

const names = variable("names", ["Alice", "Bob", "Carol"]);
const count = variable("count", 0);
const checked = variable("checked", false);

window.toggleChecked = () => {
    checked.value = !checked.value;
};

window.increment = () => {
    count.value++;
    names.value.push(generateRandomString());
};

window.decrement = () => {
    count.value--;
};

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
