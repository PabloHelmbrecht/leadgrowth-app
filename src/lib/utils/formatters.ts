/**
 * Calculates the percentage of a numerator over a denominator with a specified number of decimals.
 * @param {string | number} numerator - The numerator of the percentage calculation.
 * @param {string | number} denominator - The denominator of the percentage calculation.
 * @param {number} [decimals=1] - The number of decimal places to include in the result.
 * @returns {string} The percentage as a string, or "-" if the calculation is invalid.
 */
export function getPercentage(
    numerator: string | number,
    denominator: string | number,
    decimals = 1,
) {
    numerator = Number(numerator)
    denominator = Number(denominator)

    if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
        return "-"
    }

    return String(
        `${Math.round((numerator / denominator) * 100 * 10 ** decimals) / 10 ** decimals}%`,
    )
}

/**
 * Generates a unique identifier (UUID v4).
 * @returns {string} A randomly generated UUID.
 */
export function generateId(): string {
    const d =
        typeof performance === "undefined"
            ? Date.now()
            : performance.now() * 1000

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16 + d) % 16 | 0

        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16)
    })
}

/**
 * Converts a number to its corresponding alphabetical representation (e.g., 1 -> A, 27 -> AA).
 * @param {number} number - The number to convert.
 * @returns {string | undefined} The alphabetical representation of the number, or undefined if the number is less than 1.
 */
export function numberToLetters(number: number) {
    number = Math.round(number)

    if (number < 1) return
    let letters = ""

    while (number > 0) {
        number-- // Decrementar el número para que funcione con un índice de 0
        letters = String.fromCharCode(65 + (number % 26)) + letters
        number = Math.floor(number / 26)
    }
    return letters
}

/**
 * Truncates a string to a specified maximum length and appends "..." if truncated.
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - The maximum allowed length of the text.
 * @returns {string} The truncated text.
 */
export function reduceText(text: string, maxLength: number) {
    if (text.length <= maxLength) {
        return text
    }
    return text.substring(0, maxLength) + "..."
}

/**
 * Converts an array of items into a human-readable list.
 * @param {unknown[]} items - The array of items to format.
 * @returns {string} A string representing the list, with items separated by commas and "and" before the last item.
 */
export function makeList(items: unknown[]): string {
    return items?.reduce((str: string, mailboxId, index, list) => {
        if (index === list.length - 1) {
            return `${String(str)} and ${String(mailboxId)}`
        }
        if (index === 0) {
            return String(mailboxId)
        }

        return `${String(str)}, ${String(mailboxId)}`
    }, "")
}

/**
 * Capitalizes the first letter of each word in a string.
 * @param {string} input - The input string.
 * @returns {string} The string with each word capitalized.
 */
export function capitalizeWords(input: string): string {
    return input
        .split(" ")
        .map((word) =>
            word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : "",
        )
        .join(" ")
}
