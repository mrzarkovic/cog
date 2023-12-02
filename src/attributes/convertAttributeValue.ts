export function convertAttributeValue(value: string) {
    return value === "true"
        ? true
        : value === "false"
        ? false
        : !isNaN(Number(value))
        ? Number(value)
        : value;
}
