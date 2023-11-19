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

type ChangedElement = {
    element: HTMLElement;
    content: string | null;
};

type ElementWithHandler = Element & { [key: string]: (e: Event) => void };

const cog: Cog = (function () {
    const tree: ReactiveNode[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: Record<string, any> = {};
    let appElement: HTMLElement | null = null;

    const evaluate = (value: string) =>
        Function(
            `return (state, value) => {${Object.keys(state)
                .map((variable) => `const ${variable} = state["${variable}"];`)
                .join("\n")}; return ${value}}`
        )();

    const render = () => {
        tree.map(({ element, template }) => {
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

                const before = restOfContent.slice(0, start);
                const after = restOfContent.slice(end + 1);
                const value = htmlToText(htmlValue);

                try {
                    let evaluated = evaluate(value)(state);

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
                const oldTextNodes = Array.from(oldNode.childNodes).filter(
                    (node) => node.nodeType === Node.TEXT_NODE
                );
                const newTextNodes = Array.from(newNode.childNodes).filter(
                    (node) => node.nodeType === Node.TEXT_NODE
                );

                const textContentChanged = oldTextNodes.some(
                    (oldTextNode, index) => {
                        const newTextNode = newTextNodes[index];
                        return (
                            newTextNode &&
                            oldTextNode.textContent !== newTextNode.textContent
                        );
                    }
                );

                if (textContentChanged) {
                    return [{ element: oldNode, content: newNode.innerHTML }];
                }

                const oldAttributes = Array.from(oldNode.attributes);
                const newAttributes = Array.from(newNode.attributes);

                const attributesChanged =
                    oldAttributes.length !== newAttributes.length ||
                    oldAttributes.some((attr, index) => {
                        const newAttr = newAttributes[index];
                        return (
                            attr.name !== newAttr.name ||
                            attr.value !== newAttr.value
                        );
                    });

                if (attributesChanged) {
                    return [{ element: oldNode, content: newNode.innerHTML }];
                } else {
                    const changedChildren = Array.from(oldNode.childNodes)
                        .map((oldChild, index) =>
                            compareNodes(
                                oldChild as HTMLElement,
                                newNode.childNodes[index] as HTMLElement
                            )
                        )
                        .flat();
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

export const { variable } = cog;
