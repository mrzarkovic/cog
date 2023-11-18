type Cog = {
    variable: <T>(
        name: string,
        value: T
    ) => {
        set: (newVal: T) => void;
        value: T;
    };
};
type ReactiveNode = {
    element: HTMLElement;
    template: string;
};

type ElementWithHandler = Element & { [key: string]: (e: Event) => void };

const cog: Cog = (function () {
    const tree: ReactiveNode[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: Record<string, any> = {};
    let appElement: HTMLElement | null = null;

    const render = () => {
        // console.log(state);
        for (const { element, template } of tree) {
            let updatedContent = "";
            let restOfContent = template;
            let hasTemplateExpression = true;

            while (hasTemplateExpression) {
                const start = restOfContent.indexOf("{{");
                let end = -1;
                let stack = 0;

                for (let i = start; i < restOfContent.length; i++) {
                    if (restOfContent.slice(i, i + 2) === "{{") {
                        stack++;
                        i++;
                    } else if (restOfContent.slice(i, i + 2) === "}}") {
                        stack--;
                        i++;
                    }

                    if (stack === 0) {
                        end = i;
                        break;
                    }
                }

                if (start === -1 || end === -1 || start >= end) {
                    hasTemplateExpression = false;
                    break;
                }

                const htmlValue = restOfContent.slice(start + 2, end - 1);
                // console.log(htmlValue);
                const before = restOfContent.slice(0, start);
                const after = restOfContent.slice(end + 1);
                const value = htmlToText(htmlValue); // this part strips child html elements
                // console.log(value);
                try {
                    let evaluated = Function(`return (state) => {
                        ${Object.keys(state)
                            .map((variable) => {
                                return `const ${variable} = state["${variable}"];`;
                            })
                            .join("\n")}
                            return ${value}
                        }`)()(state);

                    if (Array.isArray(evaluated)) {
                        evaluated = evaluated.join("");
                    }
                    updatedContent += `${before}${evaluated ?? value}`;
                } catch (e: unknown) {
                    if (e instanceof Error) {
                        throw new Error(`${e.message} {{${value}}}`);
                    }
                }
                restOfContent = after;
            }
            updatedContent += restOfContent;

            if (updatedContent !== element.innerHTML) {
                removeAllEventListeners(element);
                element.innerHTML = updatedContent;
                addAllEventListeners(element);
            }
        }
    };

    const loadElements = () => {
        const xpath =
            ".//*[text()[contains(., '{{')] and text()[contains(., '}}')]]";

        const result = document.evaluate(
            xpath,
            appElement as Node,
            null,
            XPathResult.ORDERED_NODE_ITERATOR_TYPE,
            null
        );
        let element = <HTMLElement>result.iterateNext();
        while (element) {
            // console.log("Found", element.innerHTML);
            tree.push({ element, template: element.innerHTML });
            element = <HTMLElement>result.iterateNext();
        }
    };

    function escapeHtml(html: string) {
        return (
            html
                // .replace(/"(?=[^<>]*>)/g, "&quot;")
                // .replace(/'(?!<[^<>]*>)/g, "&#039;")
                .replace(/<(?=[^<>]*>)/g, "&lt;")
                .replace(/(?<=[^<>]*)>/g, "&gt;")
        );
    }

    function htmlToText(html: string) {
        const tmp = document.createElement("div");
        tmp.innerHTML = escapeHtml(html);

        return tmp.textContent || tmp.innerText || "";
    }

    function updateState<T>(name: string, value: T) {
        setTimeout(() => {
            state[name] = value;
            render();
        }, 0);
    }

    function addAllEventListeners(parent?: HTMLElement) {
        addEventListeners(parent, "click");
        addEventListeners(parent, "change");
    }

    function removeAllEventListeners(parent?: HTMLElement) {
        removeEventListeners(parent, "click");
        removeEventListeners(parent, "change");
    }

    function addEventListeners(parent?: HTMLElement, eventName = "click") {
        parent?.querySelectorAll(`[data-${eventName}]`).forEach((element) => {
            const handler = eventHandler(eventName, element);
            element.addEventListener(eventName, handler);
            (element as ElementWithHandler)[`${eventName}Handler`] = handler;
        });
    }

    function removeEventListeners(parent?: HTMLElement, eventName = "click") {
        parent?.querySelectorAll(`[data-${eventName}]`).forEach((element) => {
            const handler = (element as ElementWithHandler)[
                `${eventName}Handler`
            ];
            if (handler) {
                element.removeEventListener(eventName, handler);
            }
        });
    }

    const eventHandler = (eventName = "click", element: Element) =>
        function (e: Event) {
            const handler = element.getAttribute(`data-${eventName}`);
            if (handler) {
                try {
                    Function(`return (state) => {
                        ${Object.keys(state)
                            .map((variable) => {
                                return `const ${variable} = state["${variable}"];`;
                            })
                            .join("\n")}
                            ${handler}
                        }`)()(state);
                } catch (e: unknown) {
                    if (e instanceof Error) {
                        throw new Error(
                            `${e.message}: data-${eventName}=${handler}`
                        );
                    }
                }
            }
            e.preventDefault();
        };

    document.addEventListener("DOMContentLoaded", () => {
        appElement = document.querySelector("#app");
        if (!appElement) {
            throw new Error("No app element found!");
        }
        loadElements();
        addAllEventListeners(appElement);
        render();
    });

    return {
        variable: <T>(name: string, value: T) => {
            state[name] = value;

            return {
                set: (newVal: T) => {
                    updateState(name, newVal);
                },
                get value() {
                    return state[name];
                },
            };
        },
    };
})();

export const { variable } = cog;
