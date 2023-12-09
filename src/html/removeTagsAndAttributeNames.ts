const tagRegex = /<\/?[\w-]+/g;
const attrRegex = /[\w-]+(\s*=\s*("|')[^"']*("|'))/g;
const specialCharRegex = /[^\w\s()]/g;
const spaceRegex = /\s+/g;

export function removeTagsAndAttributeNames(htmlString: string): string {
    return htmlString
        .replace(tagRegex, "")
        .replace(attrRegex, "$1")
        .replace(specialCharRegex, " ")
        .replace(spaceRegex, " ");
}
