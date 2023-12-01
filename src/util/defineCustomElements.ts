import { CustomElementsStack, State } from "../types";
import { attributesToState } from "./helpers/attributesToState";
import { evaluateTemplate } from "./helpers/evaluateTemplate";
import { getAttributes } from "./helpers/getAttributes";
import { sanitizeHtml } from "./helpers/sanitizeHtml";

function loadTemplates(rootElement: Node) {
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
export function defineCustomElements(
    rootElement: Node,
    state: State,
    customElements: CustomElementsStack
) {
    const templates = loadTemplates(rootElement);
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < templates.length; i++) {
        const name = templates[i].getAttribute("id");

        if (name) {
            templates[i].innerHTML = sanitizeHtml(templates[i].innerHTML);
            if (templates[i].content.childNodes.length !== 1) {
                throw new Error(`Template ${name} should have a single child`);
            }

            defineCustomElement(name, templates[i], state, customElements);

            fragment.appendChild(templates[i]);
        }
    }

    fragment.textContent = "";
}

function defineCustomElement(
    name: string,
    template: HTMLTemplateElement,
    state: State,
    customElementsStack: CustomElementsStack
) {
    function CustomElement() {
        return Reflect.construct(HTMLElement, [], CustomElement);
    }

    CustomElement.prototype = Object.create(HTMLElement.prototype);
    CustomElement.prototype.constructor = CustomElement;

    CustomElement.prototype.connectedCallback = renderCustomElement(
        template,
        state,
        customElementsStack
    );

    customElements.define(name, CustomElement as never);
}

function renderCustomElement(
    template: HTMLTemplateElement,
    state: State,
    customElements: CustomElementsStack
) {
    return function (this: HTMLElement) {
        const attributes = getAttributes(this);
        const localState = attributesToState(attributes, state);
        const originalInvocation = template.innerHTML.replace(
            /\{\{\s*children\s*\}\}/g,
            this.innerHTML
        );
        const evaluatedTemplate = evaluateTemplate(
            originalInvocation,
            localState
        );
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = evaluatedTemplate;
        const newElement = tempDiv.firstChild as HTMLElement;
        this.parentNode?.insertBefore(newElement, this);

        customElements.add({
            element: newElement,
            template: originalInvocation,
            lastTemplateEvaluation: evaluatedTemplate,
            parentAttributes: attributes,
        });
        customElements.clean();

        this.parentNode?.removeChild(this);
    };
}
