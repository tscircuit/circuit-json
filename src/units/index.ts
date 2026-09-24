import {
  type BaseTscircuitUnit,
  parseAndConvertSiUnit,
} from "format-si-unit"
import { z } from "zod"
export {
  parseAndConvertSiUnit,
  type BaseTscircuitUnit,
} from "format-si-unit"

// // Currently, removing uncommon SI Prefixes for type simplicity.
// export type SIPrefix =
//   // | "y"
//   // | "yocto"
//   // | "z"
//   // | "zepto"
//   // | "atto"
//   // | "a"
//   | "femto"
//   | "f"
//   | "u"
//   | "micro"
//   // | "d"
//   // | "deci"
//   | "c"
//   | "centi"
//   | "m"
//   | "milli"
//   | "k"
//   | "kilo"
//   | "M"
//   | "mega"
// // | "G"
// // | "T"
// // | "P"
// // | "E"
// // | "Z"
// // | "Y"

// export type UnitAbbreviations = {
//   farad: "F"
//   ohm: "Ω"
//   henry: "H"
//   meter: "m"
//   volt: "V"
//   inch: "in"
//   foot: "ft"
// }

// export type Unit = keyof UnitAbbreviations
// export type NumberWithUnit<T extends Unit> =
//   | `${number}${T | UnitAbbreviations[T]}`
//   | `${number} ${T | UnitAbbreviations[T]}`
//   | `${number}${SIPrefix}${T | UnitAbbreviations[T]}`
//   | `${number} ${SIPrefix}${T | UnitAbbreviations[T]}`
// export type NumberWithAnyUnit =
//   | `${number}${UnitOrAbbreviation}`
//   | `${number} ${UnitOrAbbreviation}`
//   | `${number}${SIPrefix}${UnitOrAbbreviation}`
//   | `${number} ${SIPrefix}${UnitOrAbbreviation}`

// TODO lots of validation to make sure the unit is valid etc.
const isFiniteNumber = (v: number | null | undefined): v is number =>
  Number.isFinite(v)

const parseSiUnit = (
  v: string | number,
  unit?: BaseTscircuitUnit,
): number => {
  try {
    return parseAndConvertSiUnit(v, unit).value ?? NaN
  } catch {
    return NaN
  }
}

export const resistance = z
  .string()
  .or(z.number())
  .transform((v) => parseSiUnit(v, "Ω"))
  .refine(isFiniteNumber, {
    message: "resistance must be a finite number",
  })

export const capacitance = z
  .string()
  .or(z.number())
  .transform((v) => parseSiUnit(v, "F"))
  .refine(isFiniteNumber, {
    message: "capacitance must be a finite number",
  })
  .transform((value) => {
    return Number.parseFloat(value.toPrecision(12)) // Round to 12 significant digits
  })

export const inductance = z
  .string()
  .or(z.number())
  .transform((v) => parseSiUnit(v, "H"))
  .refine(isFiniteNumber, {
    message: "inductance must be a finite number",
  })

export const voltage = z
  .string()
  .or(z.number())
  .transform((v) => parseSiUnit(v, "V"))
  .refine(isFiniteNumber, {
    message: "voltage must be a finite number",
  })

export const length = z
  .string()
  .or(z.number())
  .transform((v) => parseSiUnit(v))
  .refine(isFiniteNumber, {
    message: "length must be a finite number",
  })

export const frequency = z
  .string()
  .or(z.number())
  .transform((v) => parseSiUnit(v, "Hz"))
  .refine(isFiniteNumber, {
    message: "frequency must be a finite number",
  })

/**
 * Length in meters
 */
export type Length = number
export type Distance = number

export const distance = length

export const current = z
  .string()
  .or(z.number())
  .transform((v) => parseSiUnit(v, "A"))
  .refine(isFiniteNumber, {
    message: "current must be a finite number",
  })

export const duration_ms = z
  .string()
  .or(z.number())
  .transform((v) => parseSiUnit(v))
  .refine(isFiniteNumber, {
    message: "duration_ms must be a finite number",
  })

export const time = duration_ms

export const ms = duration_ms

export const timestamp = z.string().datetime()

/**
 * Rotation is always converted to degrees
 */
export const rotation = z
  .string()
  .or(z.number())
  .transform((arg): number => {
    if (typeof arg === "number") return arg
    if (arg.endsWith("deg")) {
      return Number.parseFloat(arg.split("deg")[0]!)
    }
    if (arg.endsWith("rad")) {
      return (Number.parseFloat(arg.split("rad")[0]!) * 180) / Math.PI
    }
    return Number.parseFloat(arg)
  })
  .refine(isFiniteNumber, {
    message: "rotation must be a finite number",
  })

export const battery_capacity = z
  .number()
  .or(z.string().endsWith("mAh"))
  .transform((v) => {
    if (typeof v === "string") {
      const valString = v.replace("mAh", "")
      const num = Number.parseFloat(valString)
      if (Number.isNaN(num)) {
        throw new Error("Invalid capacity")
      }
      return num
    }
    return v
  })
  .describe("Battery capacity in mAh")

export type InputRotation = number | string
export type Rotation = number
