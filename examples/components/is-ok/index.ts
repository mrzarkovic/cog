import { component, variable } from "../../../src/cog";
import { count } from "../../state";

component("is-ok");

variable("isEven", () => count.value % 2 === 0);
