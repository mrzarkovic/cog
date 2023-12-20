<p align="center">
  <img src="https://raw.githubusercontent.com/mrzarkovic/cog/main/logo.png" alt="Cog Logo"/>
</p>

# ⚙️Cog

[![dependencies](https://img.shields.io/badge/dependencies-0-blue)](https://www.npmjs.com/package/@mzrk/cog?activeTab=dependencies)
[![npm](https://img.shields.io/npm/v/@mzrk/cog)](https://www.npmjs.com/package/@mzrk/cog)
![gzip](https://img.badgesize.io/mrzarkovic/Cog/main/lib/cog.js.svg?compression=gzip&label=gzip&max=8000&softmax=5000)
![Lines](https://img.shields.io/badge/coverage-81.16%25-yellow.svg?style=flat)
![license](https://img.shields.io/npm/l/@mzrk/cog)
[![downloads](https://img.shields.io/npm/dt/@mzrk/cog)](https://www.npmjs.com/package/@mzrk/cog?activeTab=versions)

> Reactive UI Library for HTML

Cog is a simple, beginner-friendly reactive UI library for building web applications, designed to provide a reactive programming experience using plain HTML and vanilla JavaScript with zero dependencies.

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

<a href="https://codepen.io/pen?template=rNPrarQ" target="_blank">
    <img src="https://img.shields.io/badge/Try%20Cog%20-Edit%20on%20CodePen-blue?logo=codepen" alt="Edit on CodePen">
</a>

### Beginner-friendly

With zero dependencies and no extra tooling needed, Cog is a beginner-friendly library that keeps things simple. It uses plain HTML for templates, making it intuitive for those who are new to JavaScript or coming from a background of HTML and CSS.

> When you see HTML in a **Cog** application, it really is just HTML! 🤯

Just HTML, but with the added power of reactive expressions. This makes it easy to understand and learn, while still providing the reactivity that makes modern web apps feel smooth and responsive.

## Installation

Just add `<script>` tag to your `index.html`

```html
<script src="https://unpkg.com/@mzrk/cog@latest/lib/cog.js"></script>
```

Or you can install it via `npm` package manager:

```bash
npm install @mzrk/cog
```

## Getting Started

We'll build a simple counter. In this example, `countVariable` is a reactive variable and `count` is the name of the state variable used in the HTML template.

We'll add a new `<script>` tag to our `index.html`. We can then get the `variable` and `render` methods from the global Cog object.

```html
<!-- index.html -->

<div id="app">...</div>
<script>
    const { variable, render } = Cog;
    // ...
</script>
```

Then we can write our counter logic and render the app when the DOM is ready:

```js
// Initialize reactive variable 'count'
const countVariable = variable("count", 0);

// Your typical callback function, nothing fancy
function incrementCount(e) {
    // Get count value and update it using count setter
    countVariable.set(countVariable.value + 1);
}

document.addEventListener("DOMContentLoaded", function () {
    // Get the root element
    const rootElement = document.getElementById("app");
    // Render the app
    render(rootElement);
});
```

In the HTML, you can use `{{ count }}` to bind a variable to the text content of an element.

```html
<!-- index.html -->

<div id="app">
    <div>{{ count }}</div>
    <button onclick="incrementCount()">Increment</button>
</div>
<script>
    ...
</script>
```

When the button is clicked, the `incrementCount` function is called, which updates the `count` variable and triggers a re-render of the UI.

## Component System

The Cog library uses Web Components to create reusable HTML templates. This allows you to define a template once and use it multiple times with different data, making your HTML more maintainable.

Templates are defined using the `<template>` HTML element with an `id`. The content inside the template can include any HTML markup and placeholders for dynamic content, enclosed in `{{ }}`.

```html
<template id="my-text">
    <div class="bold">{{ children }}</div>
</template>
```

Placeholders in the template are replaced with the corresponding data from the custom element. This can include the content of the custom element (replacing `{{ children }}`) and any data attributes on the custom element (replacing `{{ attributeName }}`).

```html
<my-text>I'm the child</my-text>
```

### Custom attributes as props

Custom data attributes (prefixed with `data-`) can be used to pass additional data to the template. Cog converts these attribute names to camelCase and makes them available as variables inside the template.

```html
<!-- Definition -->
<template id="my-checkbox">
    <label>
        <input type="checkbox" data-attribute-checked="{{ dataIsChecked }}" />
        {{ dataLabel }}
    </label>
</template>

<!-- Usage -->
<my-checkbox data-label="Check it" data-is-checked="true"></my-checkbox>
```

### Local Component State

Using the `variable()` method we can scope the reactive variables to specific templates.

```js
const count = variable("count", 0, "my-counter");
const increment = variable("increment", () => count++, "my-counter");
```

We can use local `count` and `increment` in Template like this:

```html
<template id="my-counter">
    <button data-on-click="increment()">Count is {{ count }}</button>
</template>
```

## Documentation

Ready for more? Check out the docs at [https://docs.cogjs.org](https://docs.cogjs.org/getting-started/tutorial)

## The Motivation Behind Cog

The primary motivation behind the creation of Cog is to help those who are just getting into web development. We understand that the learning curve can be steep when you're starting out, especially with the multitude of complex libraries and frameworks available today.

Cog aims to flatten this learning curve. It's designed to be a stepping stone to bigger, more complex libraries and frameworks. With Cog, you can focus on learning the core concepts of reactive programming without getting overwhelmed by additional dependencies or complex tooling. All you need is vanilla JavaScript.

### ⚠️ Puns Alert!

Cog is not just about coding; it's about reducing your cognitive efforts. Just like a cog in a machine, our library plays a small but crucial role in the larger mechanism of web development. It helps you keep the wheels of your learning journey turning smoothly, without getting stuck on the complexities of state management.

So, gear up and let Cog drive your coding journey with less cognitive friction and more fun!

## Contributions

Hey there! If you're interested in the Cog project, we'd love to have you on board. Here's how you can help out:

-   **Bug Reports**: Found a bug? Let us know! Just create an issue in the GitHub repository with the details and steps to reproduce it.

-   **Feature Requests**: Got a cool idea for a new feature or improvement? We're all ears. Drop an issue describing your idea.

-   **Code Contributions**: If you're up for contributing code, go ahead and create a pull request. Just make sure your code follows the existing style and includes tests where needed.

-   **Documentation**: Remember, good documentation is just as crucial as good code. If you can make the docs better, that would be awesome!

Thanks for considering contributing to Cog!

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright © 2023
