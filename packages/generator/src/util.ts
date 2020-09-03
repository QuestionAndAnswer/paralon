export function toCamelCase (str: string) {
    return `${str[0].toLowerCase()}${str.substr(1)}`;
}