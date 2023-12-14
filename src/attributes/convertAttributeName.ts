export const convertAttributeName = (attribute: string): string => {
    return attribute
        .split("-")
        .reduce(
            (result, part, index) =>
                result + (index ? part[0].toUpperCase() + part.slice(1) : part),
            ""
        );
};
