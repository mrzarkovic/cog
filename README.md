# Cog - Reactive Expressions

![](https://img.shields.io/badge/dependencies-0-blue)
![](https://img.badgesize.io/mrzarkovic/Cog/main/lib/cog.js.svg?compression=gzip&label=gzip&max=5000&softmax=3000)
![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg?style=flat&logo=jest)
![](https://img.shields.io/badge/version-0.0.4-red)

Cog is a simple, beginner-friendly reactive expression library for building web applications, designed to provide a reactive programming experience using plain HTML and vanilla JavaScript with zero dependencies.

```html
<!-- index.html -->

<div id="app">
    <div>Counter: {{ counter }}</div>
    <button onclick="increment()">Increment</button>
</div>
```

```js
// index.js

const counter = variable("counter", 0);
function increment() {
    counter.set(counter.value + 1);
}
```

### Beginner-friendly

With zero dependencies and no extra tooling needed, Cog is a beginner-friendly library that keeps things simple. It uses plain HTML for templates, making it intuitive for those who are new to JavaScript or coming from a background of HTML and CSS.

> When you see HTML in a **Cog** application, it really is just HTML! 🤯

Just HTML, but with the added power of reactive expressions. This makes it easy to understand and learn, while still providing the reactivity that makes modern web apps feel smooth and responsive.

## Installation

You can install Cog via npm:

```bash
npm install @mzrk/cog
```

Or with `<script>` tag in your index.html

```html
<script src="https://unpkg.com/@mzrk/cog@0.0.4/lib/cog.js"></script>
<script>
    // Use Cog global in your code
    const { variable } = Cog;
</script>
```

## Usage

In this example, `countVariable` is a reactive variable. `count` is the name of the state variable used in the HTML template.

```js
// index.js

import { variable } from "@mzrk/cog";
```

Or if you used `<script>` tag you can get `variable` from global Cog object.

```js
// index.js or <script> tag after cog.js library

const { variable } = Cog;
```

Then you can write your counter logic.

```js
// Initialize reactive variable 'count'
const countVariable = variable("count", 0);

// Your typical callback function, nothing fancy
function incrementCount(e) {
    // Get count value and update it using count setter
    countVariable.set(countVariable.value + 1);
}
```

In the HTML, you can use `{{ count }}` to bind a variable to the text content of an element.

_It's important to wrap your application inside a `<div>` with an `id` of "app". This is because Cog uses this div as the root element for your application._

```html
<!-- index.html -->

<div id="app">
    <div>{{ count }}</div>
    <button onclick="incrementCount()">Increment</button>
</div>
<script src="index.js"></script>
```

When the button is clicked, the `incrementCount` function is called, which updates the `count` variable and triggers a re-render of the UI.

## Basic concepts

### `variable`

`variable` is a function that creates a new reactive variable. It is used to create a state variable within the `state` object of the **Cog** library. It takes a name and an initial value as arguments, and adds an entry to the `state` object with the given name and value.

The function returns an object with a `set` method and a `value` getter. The `set` method allows you to update the value of the state variable from your JavaScript code. It takes a new value as an argument, and updates the state variable with this new value. The `value` getter allows you to retrieve the current value of the state variable from your JavaScript code.

```js
// index.js

import { variable } from "@mzrk/cog";

const { set, value } = variable("meaningOfLife", 41);
```

When a state variable's value is updated using the `set` method, the UI is re-rendered, and any expressions referencing that variable are re-evaluated with the new value. This design allows the expressions in your HTML to automatically update whenever the state changes.

### `state`

The `state` object is a key-value store that holds the current state of all reactive variables in the application. Each key in the `state` object corresponds to the name of a reactive variable, and the associated value is the current value of that variable.

```html
<!-- index.html -->

<div>{{ meaningOfLife + 1 }}</div>
```

When an expression is evaluated, it's done so in the context of the `state` object. This means that any variables referenced in the expression are looked up in the `state` object.

```js
// Cog.js under the hood

const state = {
    meaningOfLife: 41,
};
const expression = "meaningOfLife + 1";
evaluateExpression(expression, state); // 42
```

Cog calls the `evaluateExpression` function internally when rendering UI with reactive variables. It creates a new function with values from the state in it's scope and executes the expression.

```js
// Example function created by evaluateExpression
const func = () => {
    const meaningOfLife = 41; // variable form the state

    return meaningOfLife + 1; // expression
}();
```

## The Motivation Behind Cog

The primary motivation behind the creation of Cog is to help those who are just getting into web development. We understand that the learning curve can be steep when you're starting out, especially with the multitude of complex libraries and frameworks available today.

Cog aims to flatten this learning curve. It's designed to be a stepping stone to bigger, more complex libraries and frameworks. With Cog, you can focus on learning the core concepts of reactive programming without getting overwhelmed by additional dependencies or complex tooling. All you need is vanilla JavaScript.

Moreover, Cog is not just about coding; it's about reducing your cognitive efforts. Just like a cog in a machine, our library plays a small but crucial role in the larger mechanism of web development. It helps you keep the wheels of your learning journey turning smoothly, without getting stuck on the complexities of state management.

So, gear up and let Cog drive your coding journey with less cognitive friction and more fun!

## Contributions

Hey there! If you're interested in the Cog project, I'd love to have you on board. Here's how you can help out:

-   **Bug Reports**: Found a bug? Let me know! Just create an issue in the GitHub repository with the details and steps to reproduce it.

-   **Feature Requests**: Got a cool idea for a new feature or improvement? I'm all ears. Drop an issue describing your idea.

-   **Code Contributions**: If you're up for contributing code, go ahead and create a pull request. Just make sure your code follows the existing style and includes tests where needed.

-   **Documentation**: Remember, good documentation is just as crucial as good code. If you can make the docs better, that would be awesome!

Thanks for considering contributing to Cog!

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2023-present, Milos Zarkovic
