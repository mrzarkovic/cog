import { variable } from "cog";

const todos = variable("todos", [{ text: "hello", done: false }]);
variable("test", "hello world");

variable("save", () => {
    const todo: HTMLInputElement | null =
        document.querySelector("[data-input=todo");

    if (todo?.value) {
        todos.set([...todos.value, { text: todo.value, done: false }]);
        todo.value = "";
    }
});

variable("toggleTodo", (index: number) => {
    const newTodos = [...todos.value];
    newTodos[index].done = !newTodos[index].done;
    todos.set(newTodos);
});

variable("Checkbox", ({ index = -1, checked = false }) => {
    return `<input type="checkbox" id="todo${index}" data-change="toggleTodo(${index})" ${
        checked ? "checked" : ""
    } />`;
});
