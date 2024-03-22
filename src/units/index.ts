import { z } from "zod"

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

export const resistance = z.string()
export const capacitance = z.string()
export const inductance = z.string()
export const voltage = z.string()
export const length = z.string()
export const current = z.string()
export const time = z.string()
