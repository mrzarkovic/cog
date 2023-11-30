export const isCustomElement = (element: HTMLElement): boolean => {
    return element.tagName.includes("-");
};
