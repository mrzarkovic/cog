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

type DOMTree = ReactiveNode[];

type ChangedElement = {
    element: HTMLElement;
    content: HTMLString | null;
};

type State = Record<string, unknown>;

type ElementWithHandler = Element & { [key: string]: (e: Event) => void };
type DocumentWithHandler = Document & { onLoadHandler: () => void };

const createExpressionScope = (expression: string, state: State) => {
    const functionBody = `return (state) => {${Object.keys(state)
        .map((variable) => `const ${variable} = state["${variable}"];`)
        .join("\n")}; return ${expression}}`;

    return Function(functionBody)();
};
function evaluateExpression(expression: string, state: State): string {
    try {
        const expressionWithScope = createExpressionScope(expression, state);
        let evaluated = expressionWithScope(state);

        if (Array.isArray(evaluated)) {
            evaluated = evaluated.join("");
        }

        return evaluated ?? expression;
    } catch (e: unknown) {
        if (e instanceof Error) {
            throw new Error(
                `Failed to create function from expression {{${expression}}}: ${e.message}`
            );
        }

        return expression;
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

const render = (tree: DOMTree, state: State) => {
    let treeNodeIndex = 0;

    for (treeNodeIndex; treeNodeIndex < tree.length; treeNodeIndex++) {
        const { element, template } = tree[treeNodeIndex];

        let updatedContent = "";
        let restOfContent = template;
        let hasTemplateExpression = true;

        while (hasTemplateExpression) {
            const { start, end } = findNextTemplateExpression(restOfContent);

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

        const changedElements = findChangedElements(element, updatedContent);

        if (changedElements.length > 0) {
            changedElements.map(({ element, content }) => {
                removeAllEventListeners(element);
                element.innerHTML = content ?? "";
                addAllEventListeners(element, state);
            });
        }
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
                oldNode.attributes.toString() !== newNode.attributes.toString();

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

const loadTree = (rootElement: Node): DOMTree => {
    const tree: DOMTree = [];
    const xpath =
        ".//*[text()[contains(., '{{')] and text()[contains(., '}}')]]";

    const result = document.evaluate(
        xpath,
        rootElement,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null
    );
    let element = <HTMLElement>result.iterateNext();

    while (element) {
        tree.push({ element, template: element.innerHTML });
        element = <HTMLElement>result.iterateNext();
    }

    return tree;
};

function addAllEventListeners(parent: HTMLElement, state: State) {
    addEventListeners(parent, "click", state);
    addEventListeners(parent, "change", state);
}

function removeAllEventListeners(parent?: HTMLElement) {
    removeEventListeners(parent, "click");
    removeEventListeners(parent, "change");
}

function addEventListeners(
    parent: HTMLElement,
    eventName = "click",
    state: State
) {
    parent.querySelectorAll(`[data-on=${eventName}]`).forEach((element) => {
        const handler = makeEventHandler(eventName, element, state);
        element.addEventListener(eventName, handler);
        (element as ElementWithHandler)[`${eventName}Handler`] = handler;
    });
}

function removeEventListeners(parent?: HTMLElement, eventName = "click") {
    parent?.querySelectorAll(`[data-on=${eventName}]`).forEach((element) => {
        const handler = (element as ElementWithHandler)[`${eventName}Handler`];
        if (handler) {
            element.removeEventListener(eventName, handler);
        }
    });
}

const makeEventHandler = (
    eventName = "click",
    element: Element,
    state: State
) =>
    function (e: Event) {
        const handler = element.getAttribute(`data-handler`);

        if (handler) {
            try {
                const handlerWithScope = createExpressionScope(handler, state);
                handlerWithScope(state);
            } catch (e: unknown) {
                if (e instanceof Error) {
                    throw new Error(
                        `${e.message}: data-on=${eventName} data-handler=${handler}`
                    );
                }
            }
        }
        e.preventDefault();
    };

export const Cog = (document: Document): Cog => {
    const state: State = {};
    let tree: DOMTree = [];

    const AppElement = {
        element: null as HTMLElement | null,
        get value() {
            if (!this.element) {
                this.element = document.querySelector("#app");
            }
            if (!this.element) {
                throw new Error("No app element found!");
            }
            return this.element;
        },
    };

    function updateState<T>(name: string, value: T) {
        setTimeout(() => {
            state[name] = value;
            render(tree, state);
        }, 0);
    }

    const onLoad = () => {
        tree = loadTree(AppElement.value);
        addAllEventListeners(AppElement.value, state);
        render(tree, state);
    };

    const onLoadHandler = (document as DocumentWithHandler)["onLoadHandler"];
    if (onLoadHandler) {
        document.removeEventListener("DOMContentLoaded", onLoadHandler);
    }
    document.addEventListener("DOMContentLoaded", onLoad);
    (document as DocumentWithHandler)["onLoadHandler"] = onLoad;

    return {
        variable: <T>(name: string, value: T) => {
            state[name] = value;

            return {
                set: (newVal: T) => {
                    updateState(name, newVal);
                },
                get value() {
                    return state[name] as T;
                },
            };
        },
    };
};

const cog = Cog(document);

export const { variable } = cog;
