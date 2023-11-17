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
            const regex = /{{|}}/g;

            for (const [htmlElement, elementTemplate] of tree) {
                let match: RegExpExecArray | null;
                const stack: number[] = [];
                let newContent = elementTemplate;

                // cleanup all chidren html elements first to avoid checking twice for parent and child
                // <div>{{ foo }}<span>{{ bar }}</span></div>
                while ((match = regex.exec(elementTemplate)) !== null) {
                    if (match[0] === "{{") {
                        stack.push(match.index);
                    } else if (match[0] === "}}" && stack.length > 0) {
                        const start = stack.pop();
                        const end = match.index;

                        if (stack.length === 0 && start !== undefined) {
                            // This is the outermost {{ }}
                            const htmlValue = elementTemplate.slice(
                                start + 2,
                                end
                            );
                            const re = new RegExp(
                                `${escapeRegExp(`{{${htmlValue}}}`)}`,
                                "g"
                            );
                            const value = htmlToText(htmlValue);

                            try {
                                newContent = newContent.replace(
                                    re,
                                    eval(value) ?? value
                                );
                            } catch (e: unknown) {
                                if (e instanceof Error) {
                                    console.error(
                                        `Template {{${value}}} error: ${e.message}`
                                    );
                                }
                            }
                        }
                    }
                }
                if (newContent !== htmlElement.innerHTML) {
                    htmlElement.innerHTML = newContent;
                }
            }
        };

        const loadElements = () => {
            const xpath =
                "//*[contains(text(), '{{') and contains(text(), '}}')]";
            const result = document.evaluate(
                xpath,
                document,
                null,
                XPathResult.ORDERED_NODE_ITERATOR_TYPE,
                null
            );
            let element = <HTMLElement>result.iterateNext();
            while (element) {
                tree.set(element, element.innerHTML);
                element = <HTMLElement>result.iterateNext();
            }
        };

        function escapeRegExp(string: string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }

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
