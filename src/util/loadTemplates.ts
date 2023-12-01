import { sanitizeHtml } from "./helpers/sanitizeHtml";

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
