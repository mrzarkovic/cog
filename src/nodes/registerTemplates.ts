import { attributesToState } from "../attributes/attributesToState";
import { getAttributes } from "../attributes/getAttributes";
import { getLocalState } from "../attributes/getLocalState";
import { extractTemplateExpressions } from "../html/evaluateTemplate";
import { sanitizeHtml } from "../html/sanitizeHtml";
import {
    Attribute,
    CogHTMLElement,
    ReactiveNodesList,
    State,
    StateObject,
} from "../types";
import { elementFromString } from "./elementFromString";
import { findNodes, findReactiveNodes } from "./findNodes";
import { isCustomElement } from "./isCustomElement";
import { registerReactiveNode } from "./registerReactiveNode";

export function registerTemplates(
    rootElement: Node,
    state: StateObject,
    reactiveNodes: ReactiveNodesList,
) {
    const templates = findNodes<HTMLTemplateElement>(rootElement, "template");
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < templates.length; i++) {
        const name = templates[i].getAttribute("id");

        if (name) {
            templates[i].innerHTML = sanitizeHtml(templates[i].innerHTML);

            if (templates[i].content.children.length !== 1) {
                throw new Error(
                    `Template ${name} should have a single HTML Element child`,
                );
            }

            defineCustomElement(name, templates[i], state, reactiveNodes);

            fragment.appendChild(templates[i]);
        }
    }

    fragment.textContent = "";
}

function defineCustomElement(
    name: string,
    template: HTMLTemplateElement,
    state: StateObject,
    reactiveNodes: ReactiveNodesList,
) {
    function CustomElement() {
        return Reflect.construct(HTMLElement, [], CustomElement);
    }

    CustomElement.prototype = Object.create(HTMLElement.prototype);
    CustomElement.prototype.constructor = CustomElement;

    CustomElement.prototype.connectedCallback = registerCustomElement(
        template,
        state,
        reactiveNodes,
    );

    customElements.define(name, CustomElement as never);
}

function isInsideCustomElement(element: HTMLElement, root: Node): boolean {
    let current = element.parentElement;
    while (current && current !== root) {
        if (isCustomElement(current as HTMLElement)) {
            return true;
        }
        current = current.parentElement;
    }
    return false;
}

function addParentId(element: HTMLElement, parentId: number) {
    if (element.tagName.includes("-")) {
        element.setAttribute("data-parent-id", String(parentId));
    }
}

function addParentIdToChildren(template: string, parentId: number) {
    const newElement = elementFromString(template);

    if (newElement.nodeType !== Node.TEXT_NODE) {
        addParentId(newElement, parentId);
        const childElements = newElement.querySelectorAll("*");
        for (let i = 0; i < childElements.length; i++) {
            const child = childElements[i];
            addParentId(child as HTMLElement, parentId);
        }
    }

    let refinedTemplate = newElement.outerHTML;
    if (!refinedTemplate) {
        refinedTemplate = newElement.textContent!;
    }

    return refinedTemplate;
}

function getCustomElementAttributes(element: HTMLElement, state: State) {
    const attributes = getAttributes(element, state);
    const childrenExpressions = extractTemplateExpressions(
        element.innerHTML,
        state,
    );

    attributes.push({
        name: "children",
        value: element.innerHTML,
        expressions: childrenExpressions,
        reactive: !!childrenExpressions.length,
        dependents: [],
    });

    return attributes;
}

function registerCustomElement(
    template: HTMLTemplateElement,
    state: StateObject,
    reactiveNodes: ReactiveNodesList,
) {
    return function (this: HTMLElement) {
        const templateName = this.tagName.toLowerCase();

        const elementId = reactiveNodes.id();

        const parentId = this.dataset.parentId
            ? Number(this.dataset.parentId)
            : null;

        const parentState = getLocalState(
            parentId,
            [],
            state.value,
            reactiveNodes.list,
        );

        const refinedTemplate = addParentIdToChildren(
            template.innerHTML,
            elementId,
        );

        const attributes = getCustomElementAttributes(this, parentState);

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = refinedTemplate;

        reactiveNodes.add(
            reactiveNodes.new(elementId, parentId, attributes, templateName),
        );

        const elements = findReactiveNodes(tempDiv).filter(
            (el) => !isInsideCustomElement(el, tempDiv),
        );

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            registerChildReactiveNodes(
                element,
                parentId,
                templateName,
                attributes,
                parentState,
                reactiveNodes,
                state,
            );
        }
        const contextEl = tempDiv.firstChild as CogHTMLElement;
        contextEl.cogAnchorId = elementId;
        this.parentElement?.replaceChild(contextEl, this);
    };
}

function registerChildReactiveNodes(
    element: HTMLElement,
    parentId: number | null,
    templateName: string,
    attributes: Attribute[],
    parentState: State,
    reactiveNodes: ReactiveNodesList,
    state: StateObject,
) {
    const elementId = reactiveNodes.id();
    const template = element.outerHTML;
    state.registerTemplateState(templateName, elementId);

    let templateState: State = {};
    if (state.templates && state.templates[templateName]) {
        templateState = state.templates[templateName].customElements[elementId];
    }

    const localState = attributesToState(
        attributes,
        Object.assign({}, parentState, templateState),
    );

    const newElement = registerReactiveNode(
        elementId,
        reactiveNodes,
        element,
        template,
        localState,
        attributes,
        parentId,
        templateName,
    );

    newElement.cogAnchorId = elementId;
}
