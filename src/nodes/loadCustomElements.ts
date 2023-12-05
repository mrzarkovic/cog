import { getAttributes } from "../attributes/getAttributes";
import { sanitizeHtml } from "../html/sanitizeHtml";
import { ReactiveNodesList } from "../types";
import { elementFromString } from "./elementFromString";
import { registerReactiveNode } from "./registerReactiveNode";

function findTemplates(rootElement: Node) {
    const xpath = "template";
    const templates: HTMLTemplateElement[] = [];

    const result = document.evaluate(
        xpath,
        rootElement,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null
    );
    let element = <HTMLTemplateElement>result.iterateNext();

    while (element) {
        templates.push(element);
        element = <HTMLTemplateElement>result.iterateNext();
    }

    return templates;
}

export function loadTemplates(
    rootElement: Node,
    reactiveNodes: ReactiveNodesList
) {
    const templates = findTemplates(rootElement);
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < templates.length; i++) {
        const name = templates[i].getAttribute("id");

        if (name) {
            templates[i].innerHTML = sanitizeHtml(templates[i].innerHTML);

            if (templates[i].content.childNodes.length !== 1) {
                throw new Error(`Template ${name} should have a single child`);
            }

            defineCustomElement(name, templates[i], reactiveNodes);

            fragment.appendChild(templates[i]);
        }
    }

    fragment.textContent = "";
}

function defineCustomElement(
    name: string,
    template: HTMLTemplateElement,
    reactiveNodes: ReactiveNodesList
) {
    function CustomElement() {
        return Reflect.construct(HTMLElement, [], CustomElement);
    }

    CustomElement.prototype = Object.create(HTMLElement.prototype);
    CustomElement.prototype.constructor = CustomElement;

    CustomElement.prototype.connectedCallback = registerCustomElement(
        template,
        reactiveNodes
    );

    customElements.define(name, CustomElement as never);
}

function registerCustomElement(
    template: HTMLTemplateElement,
    reactiveNodes: ReactiveNodesList
) {
    return function (this: HTMLElement) {
        const elementId = reactiveNodes.list.length + 1;
        const attributes = getAttributes(this);
        const templateWithChildren = template.innerHTML.replace(
            /\{\{\s*children\s*\}\}/g,
            this.innerHTML
        );
        const newElement = elementFromString(templateWithChildren);
        const childElements = newElement.querySelectorAll("*");
        childElements.forEach((child) => {
            if (child.tagName.includes("-")) {
                child.setAttribute("data-parent-id", String(elementId));
            }
        });

        console.log("custom", newElement.innerHTML);
        const originalInvocation = this.outerHTML;
        this.parentElement?.replaceChild(newElement, this);
        registerReactiveNode(
            elementId,
            reactiveNodes,
            newElement,
            originalInvocation,
            attributes
        );
    };
}
