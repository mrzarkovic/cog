export const sanitizeHtml = (html: string) => {
    return html.replace(/[\r\n]+\s*/g, "");
};
