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

export function makeId(length: number): string {
  let result = ""
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
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
