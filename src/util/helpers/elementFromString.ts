export function elementFromString(htmlString: string): HTMLElement {
    const parser = new DOMParser();
    const newElementDoc = parser.parseFromString(htmlString, "text/html");
    return newElementDoc.body.firstChild as HTMLElement;
}
