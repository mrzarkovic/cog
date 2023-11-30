function escapeHtml(html: string) {
    return html
        .replace(/<(?=[^<>]*>)/g, "&lt;")
        .replace(/(?<=[^<>]*)>/g, "&gt;");
}

export function htmlToText(html: string) {
    const tmp = document.createElement("div");
    tmp.innerHTML = escapeHtml(html);

    return tmp.textContent || tmp.innerText || "";
}
