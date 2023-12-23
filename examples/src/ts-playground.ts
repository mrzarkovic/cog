import { variable, render } from "../../src/cog";

import "../components/x-greeting";
import "../components/x-list";
import "../components/is-ok";
import "../components/count-control";
import "../components/toggle-checkbox";

document.addEventListener("DOMContentLoaded", async function () {
    const appElement = document.getElementById("app")!;

    render(appElement);
});

const fps = variable("fps", 0);

const times: number[] = [];
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
