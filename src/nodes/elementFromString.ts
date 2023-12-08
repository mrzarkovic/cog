import { CogHTMLElement } from "../types";

export function elementFromString(htmlString: string): CogHTMLElement {
    const parser = new DOMParser();
    const newElementDoc = parser.parseFromString(htmlString, "text/html");
    return newElementDoc.body.firstChild as CogHTMLElement;
}
