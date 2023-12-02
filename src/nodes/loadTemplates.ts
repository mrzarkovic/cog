export function loadTemplates(rootElement: Node) {
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
