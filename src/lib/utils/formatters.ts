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

export function reduceText(text: string, maxLength: number) {
    if (text.length <= maxLength) {
        return text
    }
    return text.substring(0, maxLength) + "..."
}

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
