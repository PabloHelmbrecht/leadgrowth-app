import { neutral } from "tailwindcss/colors"

//Types
type hsb = { hue: number; saturation: number; brightness: number }

export class Color {
  hex: string
  hsb: hsb

  constructor(hex: string | undefined) {
    this.hex = hex ?? neutral["500"]
    this.hsb = this.hexToHSB(hex ?? neutral["500"])
  }

  setHex(hex: string) {
    this.hex = hex
    this.hsb = this.hexToHSB(hex)
  }

  setHSB(hsb: hsb) {
    this.hsb = hsb
    this.hex = this.hsbToHex(hsb)
  }

  getHex() {
    return this.hex
  }

  getHSB() {
    return this.hsb
  }

  private hexToHSB(hex: string): hsb {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const delta = max - min
    let hue = 0
    const saturation = max ? (delta / max) * 100 : 0
    const brightness = max * 100

    if (delta) {
      if (max === r) hue = ((g - b) / delta + (g < b ? 6 : 0)) * 60
      else if (max === g) hue = ((b - r) / delta + 2) * 60
      else hue = ((r - g) / delta + 4) * 60
    }

    return {
      hue: Math.round(hue),
      saturation: Math.round(saturation),
      brightness: Math.round(brightness),
    }
  }

  private hsbToHex({ hue, saturation, brightness }: hsb): string {
    const s = saturation / 100
    const v = brightness / 100
    const c = v * s
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1))
    const m = v - c
    let r, g, b

    if (hue < 60) {
      r = c
      g = x
      b = 0
    } else if (hue < 120) {
      r = x
      g = c
      b = 0
    } else if (hue < 180) {
      r = 0
      g = c
      b = x
    } else if (hue < 240) {
      r = 0
      g = x
      b = c
    } else if (hue < 300) {
      r = x
      g = 0
      b = c
    } else {
      r = c
      g = 0
      b = x
    }

    r = Math.round((r + m) * 255)
      .toString(16)
      .padStart(2, "0")
    g = Math.round((g + m) * 255)
      .toString(16)
      .padStart(2, "0")
    b = Math.round((b + m) * 255)
      .toString(16)
      .padStart(2, "0")

    return `#${r}${g}${b}`
  }

  adjustHSB(
    { hue, saturation, brightness } = { hue: 0, saturation: 0, brightness: 0 },
  ) {
    this.hsb.hue = (this.hsb.hue + hue) % 360
    this.hsb.saturation = Math.min(
      Math.max(this.hsb.saturation + saturation, 0),
      100,
    )
    this.hsb.brightness = Math.min(
      Math.max(this.hsb.brightness + brightness, 0),
      100,
    )
    this.hex = this.hsbToHex(this.hsb)
    return this
  }

  normalizeSB(saturation = 70, brightness = 70) {
    this.hsb.saturation = saturation
    this.hsb.brightness = brightness
    this.hex = this.hsbToHex(this.hsb)
    return this
  }
}
