import { variable } from "./Cog";

const todos = variable("todos", [{ text: "hello", done: false }]);

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
