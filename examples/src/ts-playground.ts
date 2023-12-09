import { variable, render } from "../../src/cog";

document.addEventListener("DOMContentLoaded", function () {
    render(document.getElementById("app")!);
});

const names = variable("names", ["Alice", "Bob", "Carol"]);
const count = variable("count", 0);
const checked = variable("checked", true);

variable("isOk", (count: number) => count % 2 === 0);

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

const times: number[] = [];

const fps = variable("fps", 0);

function refreshLoop() {
    window.requestAnimationFrame(() => {
        const now = performance.now();
        while (times.length > 0 && times[0] <= now - 1000) {
            times.shift();
        }
        times.push(now);
        fps.value = times.length;
        refreshLoop();
    });
}

refreshLoop();
