type Cog = {
    spin: (fn?: () => void) => void;
};
type CogWindow = typeof window & {
    Cog: Cog;
};
type ReactiveNode = {
    element: HTMLElement;
    template: string;
};

(window as CogWindow).Cog = (function () {
    const tree: ReactiveNode[] = [];

    const render = () => {
        for (const { element, template } of tree) {
            let updatedContent = "";
            let restOfContent = template;
            let hasTemplateExpression = true;

            while (hasTemplateExpression) {
                const start = restOfContent.indexOf("{{");
                let end = -1;
                let stack = 0;

                for (let i = start; i < restOfContent.length; i++) {
                    if (restOfContent.slice(i, i + 2) === "{{") {
                        stack++;
                        i++;
                    } else if (restOfContent.slice(i, i + 2) === "}}") {
                        stack--;
                        i++;
                    }

                    if (stack === 0) {
                        end = i;
                        break;
                    }
                }

                if (start === -1 || end === -1 || start >= end) {
                    hasTemplateExpression = false;
                    break;
                }

                const htmlValue = restOfContent.slice(start + 2, end - 1);
                // console.log(htmlValue);
                const before = restOfContent.slice(0, start);
                const after = restOfContent.slice(end + 1);
                const value = htmlToText(htmlValue); // this part strips child html elements
                // console.log(value);
                try {
                    let evaluated = eval(value);
                    // console.log(evaluated);
                    if (Array.isArray(evaluated)) {
                        evaluated = evaluated.join("");
                    }
                    updatedContent += `${before}${evaluated ?? value}`;
                } catch (e) {
                    updatedContent += `${before}${value}`;
                }
                restOfContent = after;
            }
            updatedContent += restOfContent;

            if (updatedContent !== element.innerHTML) {
                element.innerHTML = updatedContent;
            }
        }
    };

    const loadElements = () => {
        const xpath =
            ".//*[text()[contains(., '{{')] and text()[contains(., '}}')]]";
        const appElement = document.getElementById("app");

        if (!appElement) {
            throw new Error("No app element found");
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
            // console.log("Found", element.innerHTML);
            tree.push({ element, template: element.innerHTML });
            element = <HTMLElement>result.iterateNext();
        }
    };

    function escapeHtml(html: string) {
        return (
            html
                // .replace(/"(?=[^<>]*>)/g, "&quot;")
                // .replace(/'(?!<[^<>]*>)/g, "&#039;")
                .replace(/<(?=[^<>]*>)/g, "&lt;")
                .replace(/(?<=[^<>]*)>/g, "&gt;")
        );
    }

    function htmlToText(html: string) {
        const tmp = document.createElement("div");
        tmp.innerHTML = escapeHtml(html);

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
