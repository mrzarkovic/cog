interface Cog {
    variable: <T>(
        name: string,
        value: T
    ) => {
        set: (newVal: T) => void;
        value: T;
    };
}

type HTMLString = string;

type ReactiveNode = {
    element: HTMLElement;
    template: HTMLString;
};

type ChangedElement = {
    element: HTMLElement;
    content: HTMLString | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type State = Record<string, any>;

type ElementWithHandler = Element & { [key: string]: (e: Event) => void };

const Cog: Cog = (function () {
    const tree: ReactiveNode[] = [];
    const state: State = {};
    let appElement: HTMLElement | null = null;

    const evaluate = (value: string) =>
        Function(
            `return (state, value) => {${Object.keys(state)
                .map((variable) => `const ${variable} = state["${variable}"];`)
                .join("\n")}; return ${value}}`
        )();

    function evaluateExpression(value: string, state: State): string {
        try {
            let evaluated = evaluate(value)(state);

            if (Array.isArray(evaluated)) {
                evaluated = evaluated.join("");
            }

            return evaluated ?? value;
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw new Error(
                    `Failed to create function from expression "${value}": ${e.message}`
                );
            }

            return value;
        }
    }

    function findNextTemplateExpression(htmlText: string): {
        start: number;
        end: number;
    } {
        const start = htmlText.indexOf("{{");
        let stack = 0;

        for (let i = start; i < htmlText.length; i++) {
            if (htmlText.slice(i, i + 2) === "{{") {
                stack++;
                i++;
            } else if (htmlText.slice(i, i + 2) === "}}") {
                stack--;
                i++;
            }

            if (stack === 0) {
                return { start, end: i };
            }
        }

        return { start, end: -1 };
    }

    const render = () => {
        tree.map(({ element, template }) => {
            let updatedContent = "";
            let restOfContent = template;
            let hasTemplateExpression = true;

            while (hasTemplateExpression) {
                const { start, end } =
                    findNextTemplateExpression(restOfContent);

                if (start === -1 || end === -1 || start >= end) {
                    hasTemplateExpression = false;
                    break;
                }

                const htmlValue = restOfContent.slice(start + 2, end - 1);

                const before = restOfContent.slice(0, start);
                const after = restOfContent.slice(end + 1);
                const value = htmlToText(htmlValue);

                const evaluated = evaluateExpression(value, state);
                updatedContent += `${before}${evaluated}`;

                restOfContent = after;
            }
            updatedContent += restOfContent;

            const changedElements = findChangedElements(
                element,
                updatedContent
            );

            if (changedElements.length > 0) {
                changedElements.map(({ element, content }) => {
                    removeAllEventListeners(element);
                    element.innerHTML = content ?? "";
                    addAllEventListeners(element);
                });
            }
        });
    };

    function findChangedElements(oldElement: HTMLElement, newHtml: string) {
        const newElement = oldElement.cloneNode() as HTMLElement;
        newElement.innerHTML = newHtml;

        function compareNodes(
            oldNode: HTMLElement,
            newNode: HTMLElement
        ): ChangedElement[] {
            if (
                oldNode.nodeType === Node.ELEMENT_NODE &&
                newNode.nodeType === Node.ELEMENT_NODE
            ) {
                let textContentChanged = false;
                for (let i = 0; i < oldNode.childNodes.length; i++) {
                    const oldChild = oldNode.childNodes[i];
                    const newChild = newNode.childNodes[i];
                    if (
                        oldChild.nodeType === Node.TEXT_NODE &&
                        newChild &&
                        newChild.nodeType === Node.TEXT_NODE
                    ) {
                        if (oldChild.textContent !== newChild.textContent) {
                            textContentChanged = true;
                            break;
                        }
                    }
                }

                if (textContentChanged) {
                    return [{ element: oldNode, content: newNode.innerHTML }];
                }

                const attributesChanged =
                    oldNode.attributes.toString() !==
                    newNode.attributes.toString();

                if (attributesChanged) {
                    return [{ element: oldNode, content: newNode.innerHTML }];
                } else {
                    let changedChildren: ChangedElement[] = [];
                    for (let i = 0; i < oldNode.childNodes.length; i++) {
                        const changes = compareNodes(
                            oldNode.childNodes[i] as HTMLElement,
                            newNode.childNodes[i] as HTMLElement
                        );
                        changedChildren = changedChildren.concat(changes);
                    }
                    return changedChildren;
                }
            }
            return [];
        }

        return compareNodes(oldElement, newElement);
    }

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
            tree.push({ element, template: element.innerHTML });
            element = <HTMLElement>result.iterateNext();
        }
    };

    function escapeHtml(html: string) {
        return html
            .replace(/<(?=[^<>]*>)/g, "&lt;")
            .replace(/(?<=[^<>]*)>/g, "&gt;");
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
                    evaluate(handler)(state);
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

export const { variable } = Cog;
