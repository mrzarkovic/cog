interface Cog {
    variable: <T>(
        name: string,
        value: T
    ) => {
        set value(newVal: T);
        get value(): T;
        set: (newVal: T) => void;
    };
}

type HTMLString = string;

type Attribute = {
    name: string;
    value: string;
    reactive: boolean;
};

type ReactiveNode = {
    element: HTMLElement;
    template: HTMLString;
    attributes: Attribute[];
    parentAttributes: Attribute[];
};

type DOMTree = ReactiveNode[];

type ChangedElement = {
    element: HTMLElement;
    content?: HTMLString;
    attributes?: { name: string; newValue: string }[];
};

type State = Record<string, unknown>;

type ElementWithHandler = Element & { [key: string]: (e: Event) => void };
type DocumentWithHandler = Document & { onLoadHandler: () => void };

const templateExpressionRegex = /\{\{(.+?)\}\}/;

const createExpressionScope = (expression: string, state: State) => {
    const functionBody = `return (state) => {${Object.keys(state)
        .map((variable) => `const ${variable} = state["${variable}"];`)
        .join("\n")} return ${expression}}`;

    return Function(functionBody)();
};

export function evaluateExpression(expression: string, state: State): string {
    try {
        const expressionWithScope = createExpressionScope(expression, state);
        let evaluated = expressionWithScope(state);

        if (Array.isArray(evaluated)) {
            evaluated = evaluated.join("");
        }

        return evaluated;
    } catch (e: unknown) {
        throw new Error(
            `Failed to create function from expression {{${expression}}}: ${
                (e as Error).message
            }`
        );
    }
}

export function findNextTemplateExpression(htmlText: string): {
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

const convertAttribute = (attribute: string): string => {
    return attribute
        .split("-")
        .reduce(
            (result, part, index) =>
                result + (index ? part[0].toUpperCase() + part.slice(1) : part),
            ""
        );
};

const isCustomElement = (element: HTMLElement): boolean => {
    return element.tagName.includes("-");
};

export const render = (tree: DOMTree, state: State) => {
    let treeNodeIndex = 0;

    for (treeNodeIndex; treeNodeIndex < tree.length; treeNodeIndex++) {
        const { element, template, attributes, parentAttributes } =
            tree[treeNodeIndex];

        let updatedContent = "";
        let restOfContent = template;
        let hasTemplateExpression = true;

        if (attributes) {
            let i = 0;
            for (i; i < attributes.length; i++) {
                const attribute = attributes[i];
                const name = attribute.name;
                const value = attribute.value;
                const reactive = attribute.reactive;
                const evaluated = reactive
                    ? evaluateExpression(value, state)
                    : value;

                if (evaluated !== element.getAttribute(name)) {
                    element.setAttribute(name, evaluated);
                }
            }
        }

        if (parentAttributes) {
            let i = 0;
            for (i; i < parentAttributes.length; i++) {
                const attribute = parentAttributes[i];
                const name = attribute.name;
                const value = attribute.value;
                const reactive = attribute.reactive;
                const evaluated = reactive
                    ? evaluateExpression(value, state)
                    : value;

                state[convertAttribute(name)] = evaluated;
            }
        }

        while (hasTemplateExpression) {
            const { start, end } = findNextTemplateExpression(restOfContent);

            if (end === -1) {
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

        if (element.nodeType === Node.TEXT_NODE) {
            if (element.textContent !== updatedContent) {
                element.textContent = updatedContent;
            }
        } else {
            const changedElements = findChangedElements(
                element,
                updatedContent
            );

            if (changedElements.length > 0) {
                changedElements.map(({ element, content, attributes }) => {
                    if (content !== undefined) {
                        removeAllEventListeners(element);
                        element.innerHTML = content;
                        addAllEventListeners(element, state);
                    } else if (attributes !== undefined) {
                        attributes.map(({ name, newValue }) => {
                            element.setAttribute(name, newValue);
                        });
                    }
                });
            }
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

// function attributesChanged(
//     oldElement: HTMLElement,
//     newElement: HTMLElement
// ): boolean {
//     for (let i = 0; i < oldElement.attributes.length; i++) {
//         const oldAttr = oldElement.attributes[i];
//         const newAttr = newElement.getAttribute(oldAttr.name);
//         if (newAttr !== oldAttr.value) {
//             return true;
//         }
//     }
//     return false;
// }

function getChangedAttributes(
    oldElement: HTMLElement,
    newElement: HTMLElement
): Array<{ name: string; newValue: string }> {
    const changedAttributes: Array<{ name: string; newValue: string }> = [];

    for (let i = 0; i < oldElement.attributes.length; i++) {
        const oldAttr = oldElement.attributes[i];
        const newAttrValue = newElement.getAttribute(oldAttr.name);
        if (newAttrValue !== oldAttr.value) {
            changedAttributes.push({
                name: oldAttr.name,
                newValue: newAttrValue || "",
            });
        }
    }

    return changedAttributes;
}

function findChangedElements(oldElement: HTMLElement, newHtml: string) {
    const newElement = oldElement.cloneNode() as HTMLElement;
    newElement.innerHTML = newHtml;

    function compareNodes(
        oldNode: HTMLElement,
        newNode: HTMLElement
    ): ChangedElement[] {
        let textContentChanged = false;
        let changedChildren: ChangedElement[] = [];

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
            } else {
                const changedAttributes = getChangedAttributes(
                    oldChild as HTMLElement,
                    newChild as HTMLElement
                );
                if (changedAttributes.length > 0) {
                    changedChildren.push({
                        element: oldChild as HTMLElement,
                        attributes: changedAttributes,
                    });
                }
            }
        }

        if (textContentChanged) {
            return [{ element: oldNode, content: newNode.innerHTML }];
        } else {
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

    return compareNodes(oldElement, newElement);
}

const getAttributes = (element: HTMLElement): Attribute[] => {
    const attributes = Array.from(element.attributes).map((attribute) => {
        const reactiveMatch = templateExpressionRegex.exec(attribute.value);
        return {
            name: attribute.name,
            value: reactiveMatch ? reactiveMatch[1] : attribute.value,
            reactive: !!reactiveMatch,
        };
    });

    return attributes;
};

export const loadTree = (
    rootElement: Node,
    parentAttributes: Attribute[]
): DOMTree => {
    const tree: DOMTree = [];
    const xpath =
        "self::*[text()[contains(., '{{')] and text()[contains(., '}}')]] | self::*[@*[contains(., '{{') and contains(., '}}')]] | .//*[text()[contains(., '{{')] and text()[contains(., '}}')]] | .//*[@*[contains(., '{{') and contains(., '}}')]]";

    const result = document.evaluate(
        xpath,
        rootElement,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null
    );
    let element = <HTMLElement>result.iterateNext();

    while (element) {
        if (!isCustomElement(element)) {
            // template =
            //     templates.find(
            //         (template) =>
            //             template.getAttribute("id") ===
            //             element.tagName.toLowerCase()
            //     )?.innerHTML || "";
            const attributes = getAttributes(element);
            tree.push({
                element,
                template: element.innerHTML,
                attributes,
                parentAttributes,
            });
        }

        element = <HTMLElement>result.iterateNext();
    }

    return tree;
};

export const loadTemplates = (rootElement: Node): HTMLElement[] => {
    const templates: HTMLElement[] = [];
    const xpath = "template";

    const result = document.evaluate(
        xpath,
        rootElement,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null
    );
    let element = <HTMLElement>result.iterateNext();

    while (element) {
        templates.push(element);
        element = <HTMLElement>result.iterateNext();
    }

    return templates;
};

function addAllEventListeners(parent: HTMLElement, state: State) {
    addEventListeners(parent, "click", state);
    addEventListeners(parent, "change", state);
}

function removeAllEventListeners(parent?: HTMLElement) {
    removeEventListeners(parent, "click");
    removeEventListeners(parent, "change");
}

export function addEventListeners(
    parent: HTMLElement,
    eventName = "click",
    state: State
) {
    parent.querySelectorAll(`[data-on-${eventName}]`).forEach((element) => {
        const handler = makeEventHandler(eventName, element, state);
        element.addEventListener(eventName, handler);
        (element as ElementWithHandler)[`${eventName}Handler`] = handler;
    });
}

export function removeEventListeners(
    parent?: HTMLElement,
    eventName = "click"
) {
    parent?.querySelectorAll(`[data-on-${eventName}]`).forEach((element) => {
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
) => {
    const handler = element.getAttribute(`data-on-${eventName}`);
    if (!handler) {
        throw new Error("Missing data-handler attribute");
    }

    const handlerWithScope = createExpressionScope(handler, state);

    return function (e: Event) {
        try {
            handlerWithScope(state);
            e.preventDefault();
        } catch (e: unknown) {
            throw new Error(
                `${(e as Error).message}: data-on-${eventName}=${handler}`
            );
        }
    };
};

export const init = (document: Document): Cog => {
    const state: State = {};
    let tree: DOMTree = [];
    let templates: HTMLElement[] = [];

    function defineCustomElement(name: string, innerHTML: string) {
        function CustomElement() {
            return Reflect.construct(HTMLElement, [], CustomElement);
        }

        CustomElement.prototype = Object.create(HTMLElement.prototype);
        CustomElement.prototype.constructor = CustomElement;

        CustomElement.prototype.connectedCallback = function () {
            const attributes = getAttributes(this);

            // Create a temporary div element
            const tempDiv = document.createElement("div");
            // Set its innerHTML to the HTML string
            tempDiv.innerHTML = innerHTML.replace(
                /\{\{\s*children\s*\}\}/g,
                this.innerHTML
            );

            // Replace the current element with each of the new elements
            while (tempDiv.firstChild) {
                const newElement = tempDiv.firstChild;
                this.parentNode.insertBefore(newElement, this);
                if (newElement.nodeType === Node.TEXT_NODE) {
                    const textContent =
                        (newElement as HTMLElement).textContent ?? "";
                    const hasTemplateExpression =
                        templateExpressionRegex.test(textContent);

                    if (hasTemplateExpression) {
                        tree.push({
                            element: newElement as HTMLElement,
                            template:
                                (newElement as HTMLElement).textContent ?? "",
                            attributes: [],
                            parentAttributes: attributes,
                        });
                    }
                } else {
                    if (!isCustomElement(newElement as HTMLElement)) {
                        tree = tree.concat(loadTree(newElement, attributes));
                    }
                }
            }

            this.parentNode.removeChild(this);
        };

        customElements.define(name, CustomElement as never);
    }

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

    function defineCustomElements(templates: HTMLElement[]) {
        templates.forEach((template) => {
            const name = template.getAttribute("id");
            if (!name) {
                throw new Error("Missing id attribute");
            }
            defineCustomElement(name, template.innerHTML);
        });
    }

    const onLoad = () => {
        tree = loadTree(AppElement.value, []);
        templates = loadTemplates(AppElement.value);
        defineCustomElements(templates);
        console.log(tree);
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
                set value(newVal: T) {
                    updateState(name, newVal);
                },
                get value() {
                    return state[name] as T;
                },
                set: (newVal: T) => {
                    updateState(name, newVal);
                },
            };
        },
    };
};

export const { variable } = init(document);
