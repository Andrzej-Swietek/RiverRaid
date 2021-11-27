/**
 * Querying Elements With Tagged Template Literals
 */

export function queryAll(strings, ...values): NodeList {
    const string = values.reduce( (finalString, value, index) => {
        return `${finalString}${value}${strings[index + 1]}`
    }, strings[0])

    return document.querySelectorAll(string);
}

/**
 * Querying Single HTML Element With Tagged Template Literalss
 * @param strings
 * @param values
 */
export function query<T>(strings, ...values): T {
    const string = values.reduce( (finalString, value, index) => {
        return `${finalString}${value}${strings[index + 1]}`
    }, strings[0])

    return document.querySelector(string);
}
