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

type ReactiveTemplateNode = {
    element: HTMLElementFromTemplate;
    template: HTMLString;
    lastEvaluation: string;
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
type HTMLElementFromTemplate = HTMLElement & {
    lastTemplateEvaluation: string;
    originalTemplateInvocation: string;
};

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

const evaluateTemplate = (template: string, state: State): string => {
    let restOfContent = template;
    let hasTemplateExpression = true;
    let updatedContent = "";

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

    return updatedContent;
};

export const render = (tree: DOMTree, state: State) => {
    // TODO: special render for templates tree
    // to compare last template evaluation with current one
    // Example:
    // "<div><x-child data-child="{{ dataParent }}"></x-child></div>"
    // "<div><x-child data-child="0"></x-child></div>"

    let treeNodeIndex = 0;
    for (treeNodeIndex; treeNodeIndex < tree.length; treeNodeIndex++) {
        const localState: State = { ...state };
        const { element, template, attributes, parentAttributes } =
            tree[treeNodeIndex];

        if (parentAttributes) {
            let i = 0;
            for (i; i < parentAttributes.length; i++) {
                const attribute = parentAttributes[i];
                const name = attribute.name;
                const value = attribute.value;
                const reactive = attribute.reactive;
                const evaluated = reactive
                    ? evaluateExpression(value, localState)
                    : value;

                localState[convertAttribute(name)] = evaluated;
            }
        }

        if (attributes) {
            let i = 0;
            for (i; i < attributes.length; i++) {
                const attribute = attributes[i];
                const name = attribute.name;
                const value = attribute.value;
                const reactive = attribute.reactive;
                const evaluated = reactive
                    ? evaluateExpression(value, localState)
                    : value;

                if (evaluated !== element.getAttribute(name)) {
                    element.setAttribute(name, evaluated);
                }
            }
        }

        const updatedContent = evaluateTemplate(template, localState);

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
                        addAllEventListeners(element, localState);
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

export const renderTemplates = (tree: ReactiveTemplateNode[], state: State) => {
    // TODO: special render for templates tree
    // to compare last template evaluation with current one
    // Example:
    // "<div><x-child data-child="{{ dataParent }}"></x-child></div>"
    // "<div><x-child data-child="0"></x-child></div>"

    let treeNodeIndex = 0;
    for (treeNodeIndex; treeNodeIndex < tree.length; treeNodeIndex++) {
        const localState: State = { ...state };
        const {
            element,
            template,
            attributes,
            parentAttributes,
            lastEvaluation,
        } = tree[treeNodeIndex];

        if (parentAttributes) {
            let i = 0;
            for (i; i < parentAttributes.length; i++) {
                const attribute = parentAttributes[i];
                const name = attribute.name;
                const value = attribute.value;
                const reactive = attribute.reactive;
                const evaluated = reactive
                    ? evaluateExpression(value, localState)
                    : value;

                localState[convertAttribute(name)] = evaluated;
            }
        }

        if (attributes) {
            let i = 0;
            for (i; i < attributes.length; i++) {
                const attribute = attributes[i];
                const name = attribute.name;
                const value = attribute.value;
                const reactive = attribute.reactive;
                const evaluated = reactive
                    ? evaluateExpression(value, localState)
                    : value;

                if (evaluated !== element.getAttribute(name)) {
                    element.setAttribute(name, evaluated);
                }
            }
        }

        const updatedContent = evaluateTemplate(template, localState);
        const changedElements = findChangedTemplateElements(
            lastEvaluation,
            updatedContent
        );

        if (changedElements.length > 0) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(updatedContent, "text/html");
            const newElement = doc.body.firstChild as HTMLElementFromTemplate;
            newElement.lastTemplateEvaluation = updatedContent;
            newElement.originalTemplateInvocation = template;

            // Version with replacing the whole template invocation
            // And triggering callback for custom templates
            // element.parentNode?.replaceChild(newElement, element);

            element.innerHTML = newElement.innerHTML;

            // changedElements.map(({ element, content, attributes }) => {
            // TODO: find exact changed element in template and replace
            // only that element with original part of the template
            // For example, findCahngedTemplateElements can return index
            // of changed child node
            // removeAllEventListeners(element);

            // if (content !== undefined) {
            //     element.innerHTML = content;
            // } else if (attributes !== undefined) {
            //     attributes.map(({ name, newValue }) => {
            //         element.setAttribute(name, newValue);
            //     });
            // }
            // addAllEventListeners(element, localState);
            // });
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

const sanitizeHtml = (html: string) => {
    return html.replace(/[\r\n]+\s*/g, "");
};

function findChangedTemplateElements(oldHtml: string, newHtml: string) {
    const oldElement = document.createElement("div");
    oldElement.innerHTML = oldHtml;
    const newElement = document.createElement("div");
    newElement.innerHTML = newHtml;

    function compareNodes(
        oldNode: HTMLElement,
        newNode: HTMLElement
    ): ChangedElement[] {
        if (oldNode.nodeType === Node.TEXT_NODE) {
            if (oldNode.textContent !== newNode.textContent) {
                return [{ element: oldNode, content: newNode.innerHTML }];
            }

            return [];
        } else {
            // const oldNodeSanitized = oldNode.innerHTML.replace(/\r?\n|\r/g, "");
            // const newNodeSanitized = newNode.innerHTML.replace(/\r?\n|\r/g, "");

            oldNode.innerHTML = sanitizeHtml(oldNode.innerHTML);
            newNode.innerHTML = sanitizeHtml(newNode.innerHTML);

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
                } else if (oldChild.nodeType === Node.ELEMENT_NODE) {
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
    }

    return compareNodes(oldElement, newElement);
}

function findChangedElements(oldElement: HTMLElement, newHtml: string) {
    const newElement = oldElement.cloneNode() as HTMLElement;
    newElement.innerHTML = newHtml;

    function compareNodes(
        oldNode: HTMLElement,
        newNode: HTMLElement
    ): ChangedElement[] {
        if (oldNode.nodeType === Node.TEXT_NODE) {
            if (oldNode.textContent !== newNode.textContent) {
                return [{ element: oldNode, content: newNode.innerHTML }];
            }

            return [];
        } else {
            // const oldNodeSanitized = oldNode.innerHTML.replace(/\r?\n|\r/g, "");
            // const newNodeSanitized = newNode.innerHTML.replace(/\r?\n|\r/g, "");

            oldNode.innerHTML = sanitizeHtml(oldNode.innerHTML);
            newNode.innerHTML = sanitizeHtml(newNode.innerHTML);

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
                } else if (oldChild.nodeType === Node.ELEMENT_NODE) {
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

export const loadTemplates = (rootElement: Node): HTMLTemplateElement[] => {
    const templates: HTMLTemplateElement[] = [];
    const xpath = "template";

    const result = document.evaluate(
        xpath,
        rootElement,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null
    );
    let element = <HTMLTemplateElement>result.iterateNext();

    while (element) {
        element.innerHTML = sanitizeHtml(element.innerHTML);
        templates.push(element);
        element = <HTMLTemplateElement>result.iterateNext();
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

const cleanTemplatesTree = (
    templatesTree: ReactiveTemplateNode[]
): ReactiveTemplateNode[] => {
    return templatesTree.filter(({ element }) => {
        return document.body.contains(element);
    });
};

export const init = (document: Document): Cog => {
    const state: State = {};
    let tree: DOMTree = [];
    let templates: HTMLTemplateElement[] = [];
    let templatesTree: ReactiveTemplateNode[] = [];

    function defineCustomElement(name: string) {
        function CustomElement() {
            return Reflect.construct(HTMLElement, [], CustomElement);
        }

        CustomElement.prototype = Object.create(HTMLElement.prototype);
        CustomElement.prototype.constructor = CustomElement;

        CustomElement.prototype.connectedCallback = function () {
            console.log("new custom element added to DOM", name);
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const customElement: HTMLElementFromTemplate = this;
            const template = templates.find(
                (template) =>
                    template.getAttribute("id") ===
                    customElement.tagName.toLowerCase()
            )!;

            const attributes = getAttributes(customElement);
            // Create a temporary div element
            const tempDiv = document.createElement("div");
            // Set its innerHTML to the HTML string
            tempDiv.innerHTML = template.innerHTML.replace(
                /\{\{\s*children\s*\}\}/g,
                customElement.innerHTML
            );

            // Parse all the expressions in template
            // and replace them with their evaluated value

            const localState: State = { ...state };

            for (const attribute of attributes) {
                let attributeValue = attribute.value;
                if (attribute.reactive) {
                    attributeValue = evaluateExpression(attributeValue, state);
                }
                localState[convertAttribute(attribute.name)] = attributeValue;
            }

            const xpathResult = document.evaluate(
                "//*[contains(name(), '-')]",
                tempDiv,
                null,
                XPathResult.ANY_TYPE,
                null
            );

            let customChildElement = xpathResult.iterateNext();
            const customChildElements = [];

            while (customChildElement) {
                customChildElements.push(customChildElement);
                customChildElement = xpathResult.iterateNext();
            }

            // for (const customChildElement of customChildElements) {
            //     (customChildElement as HTMLElement).setAttribute(
            //         "data-child-of",
            //         name
            //     );
            // }

            const originalInvocation =
                customElement.originalTemplateInvocation || tempDiv.innerHTML;

            const evaluatedTemplate = evaluateTemplate(
                tempDiv.innerHTML,
                localState
            );

            // console.log(evaluatedTemplate);
            tempDiv.innerHTML = evaluatedTemplate;

            const lastTemplateEvaluation = evaluatedTemplate;
            //     const customElementAttributes = getAttributes(
            //         customChildElement as HTMLElement
            //     );
            //     for (const attribute of customElementAttributes) {
            //         if (attribute.reactive) {
            //             const attributeValue = evaluateExpression(
            //                 attribute.value,
            //                 localState
            //             );
            //             (customChildElement as HTMLElement).setAttribute(
            //                 attribute.name,
            //                 attributeValue
            //             );
            //         }
            //     }
            // }

            // Replace the current element with each of the new elements
            // while (tempDiv.firstChild) {
            const newElement = tempDiv.firstChild as HTMLElementFromTemplate;
            // console.log(newElement);

            customElement.parentNode?.insertBefore(newElement, customElement);

            if (!customElement.dataset.childOf && newElement) {
                if (newElement.nodeType === Node.TEXT_NODE) {
                    const textContent = newElement.textContent ?? "";
                    const hasTemplateExpression =
                        templateExpressionRegex.test(textContent);

                    if (hasTemplateExpression) {
                        templatesTree.push({
                            element: newElement,
                            template: textContent,
                            attributes: [],
                            parentAttributes: attributes,
                            lastEvaluation: textContent,
                        });
                    }
                } else {
                    if (!isCustomElement(newElement as HTMLElement)) {
                        templatesTree.push({
                            element: newElement,
                            template: originalInvocation,
                            lastEvaluation: lastTemplateEvaluation,
                            attributes: getAttributes(newElement),
                            parentAttributes: attributes,
                        });
                    }
                }

                // const newTree = loadTree(AppElement.value, []);
                templatesTree = cleanTemplatesTree(templatesTree);
                console.log("tree", templatesTree);
                // render(newTree, state);
            }
            // }

            customElement.parentNode?.removeChild(customElement);
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

    function reRender() {
        render(tree, state);
        // templatesTree = cleanTemplatesTree(templatesTree);
        // console.log(templatesTree);
        renderTemplates(templatesTree, state);
    }

    function updateState<T>(name: string, value: T) {
        setTimeout(() => {
            state[name] = value;
            reRender();
        }, 0);
    }

    function defineCustomElements(templates: HTMLTemplateElement[]) {
        templates.forEach((template) => {
            const name = template.getAttribute("id");
            if (!name) {
                throw new Error("Missing id attribute");
            }

            if (template.content.childNodes.length !== 1) {
                throw new Error(`Template ${name} should have a single child`);
            }
            defineCustomElement(name);
        });
    }

    const onLoad = () => {
        tree = loadTree(AppElement.value, []);
        templates = loadTemplates(AppElement.value);
        defineCustomElements(templates);
        addAllEventListeners(AppElement.value, state);
        reRender();
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
