export function findNodes<T>(
    rootElement: Node,
    xpath: string,
    check: (element: T) => boolean = () => true
) {
    const elements: T[] = [];

    const result = document.evaluate(
        xpath,
        rootElement,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null
    );
    let element = <T>result.iterateNext();

    while (element) {
        if (check(element)) {
            elements.push(element);
        }

        element = <T>result.iterateNext();
    }

    return elements;
}
