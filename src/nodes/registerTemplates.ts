import { attributesToState } from "../attributes/attributesToState";
import { getAttributes } from "../attributes/getAttributes";
import { getLocalState } from "../attributes/getLocalState";
import { extractTemplateExpressions } from "../html/evaluateTemplate";
import { sanitizeHtml } from "../html/sanitizeHtml";
import { ReactiveNodesList, State } from "../types";
import { elementFromString } from "./elementFromString";
import { findNodes } from "./findNodes";
import { registerReactiveNode } from "./registerReactiveNode";

export function registerTemplates(
    rootElement: Node,
    state: State,
    reactiveNodes: ReactiveNodesList
) {
    const templates = findNodes<HTMLTemplateElement>(rootElement, "template");
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < templates.length; i++) {
        const name = templates[i].getAttribute("id");

        if (name) {
            templates[i].innerHTML = sanitizeHtml(templates[i].innerHTML);

            if (templates[i].content.childNodes.length !== 1) {
                throw new Error(`Template ${name} should have a single child`);
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
    state: State,
    reactiveNodes: ReactiveNodesList
) {
    function CustomElement() {
        return Reflect.construct(HTMLElement, [], CustomElement);
    }

    CustomElement.prototype = Object.create(HTMLElement.prototype);
    CustomElement.prototype.constructor = CustomElement;

    CustomElement.prototype.connectedCallback = registerCustomElement(
        template,
        state,
        reactiveNodes
    );

    customElements.define(name, CustomElement as never);
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
        state
    );
    attributes.push({
        name: "children",
        value: element.innerHTML,
        expressions: childrenExpressions,
        reactive: !!childrenExpressions.length,
    });

    return attributes;
}

function registerCustomElement(
    template: HTMLTemplateElement,
    state: State,
    reactiveNodes: ReactiveNodesList
) {
    return function (this: HTMLElement) {
        const elementId = reactiveNodes.id();
        const parentId = this.dataset.parentId
            ? Number(this.dataset.parentId)
            : null;

        const parentState = getLocalState(
            parentId,
            [],
            state,
            [],
            reactiveNodes.list
        );

        const attributes = getCustomElementAttributes(this, parentState);

        const refinedTemplate = addParentIdToChildren(
            template.innerHTML,
            elementId
        );

        const localState = attributesToState(attributes, parentState, []);

        const newElement = registerReactiveNode(
            elementId,
            reactiveNodes,
            this,
            refinedTemplate,
            localState,
            attributes,
            parentId
        );

        newElement.cogAnchorId = elementId;
    };
}
