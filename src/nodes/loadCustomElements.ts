import { attributesToState } from "../attributes/attributesToState";
import { getAttributes } from "../attributes/getAttributes";
import { evaluateTemplate } from "../html/evaluateTemplate";
import { sanitizeHtml } from "../html/sanitizeHtml";
import { Attribute, ReactiveNode, ReactiveNodesList, State } from "../types";
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
    state: State,
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

function getLocalState(
    parentId: number | null,
    attributes: Attribute[],
    globalState: State,
    reactiveNodes: ReactiveNode[]
) {
    if (parentId === null) {
        return attributesToState(attributes, globalState);
    }

    const parentNode = reactiveNodes.find((rn) => rn.id === parentId);

    const parentState: State = getLocalState(
        parentNode!.parentId,
        parentNode!.attributes,
        globalState,
        reactiveNodes
    );

    return Object.assign(
        {},
        parentState,
        attributesToState(attributes, parentState)
    );
}

function registerCustomElement(
    template: HTMLTemplateElement,
    state: State,
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
        const refinedTemplate = newElement.outerHTML;

        const parentId = this.dataset.parentId
            ? Number(this.dataset.parentId)
            : null;

        const localState = getLocalState(
            parentId,
            attributes,
            state,
            reactiveNodes.list
        );
        const updatedContent = evaluateTemplate(refinedTemplate, localState);
        const evaluatedElement = elementFromString(updatedContent);

        this.parentElement?.replaceChild(evaluatedElement, this);
        // registerReactiveNode(
        //     elementId,
        //     reactiveNodes,
        //     newElement,
        //     originalInvocation,
        //     attributes
        // );
    };
}
