import { useCallback, useMemo } from "react"
import { useLocale } from "next-intl"

/**
 * Custom hook that provides dynamic number parsing and formatting functions
 * based on the current locale. It uses the Intl.NumberFormat API to determine
 * the group and decimal separators, and then exposes functions to parse a
 * formatted string into a number and format a number into a localized string.
 *
 * @returns {object} An object containing:
 *  - {@link parseNumber}: Function to parse a formatted number string to a number.
 *  - {@link formatNumber}: Function to format a number to a localized string.
 */
export function useDynamicNumberParser() {
    const locale = useLocale()

    // Dynamically retrieve the group and decimal separators for the current locale.
    const { groupSeparator, decimalSeparator } = useMemo(() => {
        const formatter = new Intl.NumberFormat(locale)
        const parts = formatter.formatToParts(1000.1)
        const group = parts.find((part) => part.type === "group")?.value ?? ""
        const decimal =
            parts.find((part) => part.type === "decimal")?.value ?? "."
        return { groupSeparator: group, decimalSeparator: decimal }
    }, [locale])

    /**
     * Escapes special characters in a string for use in a regular expression.
     *
     * @param {string} s - The string to escape.
     * @returns {string} The escaped string.
     */
    const escapeRegExp = (s: string): string =>
        s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

    /**
     * Parses a formatted number string into a number.
     *
     * This function removes the group separator and replaces the locale-specific
     * decimal separator with a dot, so that the resulting string can be parsed by
     * parseFloat.
     *
     * @param {string} formattedNumber - The formatted number string (e.g., "1.234,56" in "es-ES").
     * @returns {number} The parsed number.
     */
    const parseNumber = useCallback(
        (formattedNumber: string): number => {
            const groupRegex = new RegExp(escapeRegExp(groupSeparator), "g")
            const decimalRegex = new RegExp(escapeRegExp(decimalSeparator))
            const normalized = formattedNumber
                .replace(groupRegex, "")
                .replace(decimalRegex, ".")
            return parseFloat(normalized)
        },
        [groupSeparator, decimalSeparator],
    )

    /**
     * Formats a number into a localized string.
     *
     * @param {number} num - The number to format.
     * @returns {string} The formatted number string.
     */
    const formatNumber = (num: number): string => {
        return new Intl.NumberFormat(locale, {
            maximumFractionDigits: 2,
        }).format(num)
    }

    return { parseNumber, formatNumber, decimalSeparator, groupSeparator }
}
