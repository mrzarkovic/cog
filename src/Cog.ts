type Cog = {
    spin: (fn?: () => void) => void;
};
type CogWindow = typeof window & {
    Cog: Cog;
};
type ElementTemplate = string;

document.addEventListener("DOMContentLoaded", () => {
    (window as CogWindow).Cog = (function () {
        const tree = new Map<HTMLElement, ElementTemplate>();

        const render = () => {
            for (const [htmlElement, elementTemplate] of tree) {
                let hasTemplateExpression = true;
                let updatedContent = "";
                let restOfContent = elementTemplate;

                while (hasTemplateExpression) {
                    const start = restOfContent.indexOf("{{");
                    const end = restOfContent.indexOf("}}");

                    if (start === -1 || end === -1) {
                        hasTemplateExpression = false;
                        break;
                    }

                    const htmlValue = restOfContent.slice(start + 2, end);
                    const before = restOfContent.slice(0, start);
                    const after = restOfContent.slice(end + 2);
                    const value = htmlToText(htmlValue);

                    updatedContent += `${before}${eval(value) ?? value}`;
                    restOfContent = after;
                }

                if (updatedContent !== htmlElement.innerHTML) {
                    htmlElement.innerHTML = updatedContent;
                }
            }
        };

        const loadElements = () => {
            const xpath = ".//*[contains(., '{{') and contains(., '}}')]";
            // "//*[contains(text(), '{{') and contains(text(), '}}')]";
            const appElement = document.getElementById("app");

            if (!appElement) {
                console.error('Element with id "app" not found');
                return;
            }

            const result = document.evaluate(
                xpath,
                appElement,
                null,
                XPathResult.ORDERED_NODE_ITERATOR_TYPE,
                null
            );
            let element = <HTMLElement>result.iterateNext();
            while (element) {
                console.log("found", element);
                tree.set(element, element.innerHTML);
                element = <HTMLElement>result.iterateNext();
            }
        };

        function htmlToText(html: string) {
            const tmp = document.createElement("div");
            tmp.innerHTML = html;

            return tmp.textContent || tmp.innerText || "";
        }

        loadElements();
        render();

        return {
            spin: (fn?: () => void) => {
                setTimeout(() => {
                    typeof fn === "function" && fn();
                    render();
                }, 0);
            },
        };
    })();
});
