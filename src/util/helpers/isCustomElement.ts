export const isCustomElement = (element: HTMLElement): boolean => {
    return (
        element.nodeType !== Node.TEXT_NODE &&
        element.tagName.indexOf("-") !== -1
    );
};
