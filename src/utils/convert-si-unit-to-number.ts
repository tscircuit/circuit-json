import { getSiPrefixMultiplier } from "format-si-unit"

type UnitInfo = {
  baseUnit: BaseTscircuitUnit
  conversionFactor: number
}

const unitMappings: Record<
  string,
  { baseUnit: BaseTscircuitUnit; variants: Record<string, number> }
> = {
  Hz: {
    baseUnit: "Hz",
    variants: {
      MHz: 1e6,
      kHz: 1e3,
      Hz: 1,
    },
  },
  g: {
    baseUnit: "g",
    variants: {
      kg: 1e3,
      g: 1,
    },
  },
  Ω: {
    baseUnit: "Ω",
    variants: {
      mΩ: 1e-3,
      mohm: 1e-3,
      mOhm: 1e-3,
      milliohm: 1e-3,
      Ω: 1,
      ohm: 1,
      Ohm: 1,
      kΩ: 1e3,
      KΩ: 1e3,
      kohm: 1e3,
      kOhm: 1e3,
      KOhm: 1e3,
      Kohm: 1e3,
      MΩ: 1e6,
      Mohm: 1e6,
      MOhm: 1e6,
      megohm: 1e6,
      Megohm: 1e6,
      GΩ: 1e9,
      Gohm: 1e9,
      GOhm: 1e9,
      TΩ: 1e12,
      Tohm: 1e12,
      TOhm: 1e12,
    },
  },
  V: {
    baseUnit: "V",
    variants: {
      mV: 1e-3,
      V: 1,
      kV: 1e3,
      KV: 1e3,
      MV: 1e6,
      GV: 1e9,
      TV: 1e12,
    },
  },
  A: {
    baseUnit: "A",
    variants: {
      µA: 1e-6,
      mA: 1e-3,
      ma: 1e-3,
      A: 1,
      kA: 1e3,
      MA: 1e6,
    },
  },
  F: {
    baseUnit: "F",
    variants: {
      pF: 1e-12,
      nF: 1e-9,
      µF: 1e-6,
      uF: 1e-6,
      mF: 1e-3,
      F: 1,
      kF: 1e3,
      KF: 1e3,
      MF: 1e6,
    },
  },
  H: {
    baseUnit: "H",
    variants: {
      pH: 1e-12,
      nH: 1e-9,
      µH: 1e-6,
      uH: 1e-6,
      mH: 1e-3,
      H: 1,
      kH: 1e3,
      KH: 1e3,
      MH: 1e6,
    },
  },
  ml: {
    baseUnit: "ml",
    variants: {
      ml: 1,
      mL: 1,
      l: 1e3,
      L: 1e3,
    },
  },
  deg: {
    baseUnit: "deg",
    variants: {
      rad: 180 / Math.PI,
    },
  },
  ms: {
    baseUnit: "ms",
    variants: {
      fs: 1e-12,
      ps: 1e-9,
      ns: 1e-6,
      us: 1e-3,
      µs: 1e-3,
      ms: 1,
      s: 1000,
    },
  },
  mm: {
    baseUnit: "mm",
    variants: {
      nm: 1e-6,
      µm: 1e-3,
      um: 1e-3,
      mm: 1,
      cm: 10,
      dm: 100,
      m: 1000,
      km: 1e6,
      in: 25.4,
      ft: 304.8,
      IN: 25.4,
      FT: 304.8,
      yd: 914.4,
      mi: 1.609344e6,
      mil: 0.0254,
    },
  },
}

const unitMappingAndVariantSuffixes = new Set()
for (const [baseUnit, info] of Object.entries(unitMappings)) {
  unitMappingAndVariantSuffixes.add(baseUnit)
  for (const variant of Object.keys(info.variants)) {
    unitMappingAndVariantSuffixes.add(variant)
  }
}

function getBaseTscircuitUnit(unit: string): UnitInfo {
  for (const [baseUnit, info] of Object.entries(unitMappings)) {
    if (unit in info.variants) {
      return {
        baseUnit: info.baseUnit,
        conversionFactor: info.variants[unit]!,
      }
    }

    for (const [variant, conversionFactor] of Object.entries(info.variants)) {
      if (!unit.endsWith(variant)) continue

      const prefix = unit.slice(0, -variant.length)
      const prefixMultiplier = getSiPrefixMultiplier(prefix)

      if (prefixMultiplier == null) continue

      return {
        baseUnit: info.baseUnit,
        conversionFactor: prefixMultiplier * conversionFactor,
      }
    }
  }
  return {
    baseUnit: unit as BaseTscircuitUnit,
    conversionFactor: 1,
  }
}

type BaseTscircuitUnit =
  | "ms"
  | "mm"
  | "g"
  | "deg"
  | "Hz"
  | "ml"
  | "V"
  | "A"
  | "Ω"
  | "F"
  | "H"

export function parseAndConvertSiUnit(
  v: {
    x: string | number
    y: string | number
  },
  unitOfValue?: BaseTscircuitUnit,
): {
  parsedUnit: string | null
  unitOfValue: BaseTscircuitUnit | null
  value: { x: number; y: number } | null
}
export function parseAndConvertSiUnit(
  v: string | number | undefined | null,
  unitOfValue?: BaseTscircuitUnit,
): {
  parsedUnit: string | null
  unitOfValue: BaseTscircuitUnit | null
  value: number | null
}
export function parseAndConvertSiUnit(
  v:
    | string
    | number
    | undefined
    | null
    | { x: string | number; y: string | number },
  unitOfValue?: BaseTscircuitUnit,
): {
  parsedUnit: string | null
  unitOfValue: BaseTscircuitUnit | null
  value: null | number | { x: number; y: number }
} {
  if (v === undefined || v === null)
    return { parsedUnit: null, unitOfValue: null, value: null }
  if (typeof v === "string" && v.match(/^-?[\d\.]+$/))
    return {
      value: Number.parseFloat(v),
      parsedUnit: null,
      unitOfValue: null,
    }
  if (typeof v === "number")
    return { value: v, parsedUnit: null, unitOfValue: null }
  if (typeof v === "object" && "x" in v && "y" in v) {
    const firstResult = parseAndConvertSiUnit(v.x, unitOfValue)
    const xResult = parseAndConvertSiUnit(v.x, unitOfValue)
    const yResult = parseAndConvertSiUnit(v.y, unitOfValue)
    if (xResult.value === null || yResult.value === null) {
      return { parsedUnit: null, unitOfValue: null, value: null }
    }
    return {
      parsedUnit: firstResult.parsedUnit,
      unitOfValue: firstResult.unitOfValue,
      value: {
        x: xResult.value,
        y: yResult.value,
      },
    }
  }
  const reversed_input_string = v.toString().split("").reverse().join("")
  const unit_reversed = reversed_input_string.match(/[^\d\s]+/)?.[0]
  if (!unit_reversed) {
    throw new Error(`Could not determine unit: "${v}"`)
  }
  const unit = unit_reversed.split("").reverse().join("")

  const numberPart = v.slice(0, -unit.length)
  const bareSiPrefixMultiplier = getSiPrefixMultiplier(unit)
  if (unitOfValue && bareSiPrefixMultiplier != null) {
    return {
      parsedUnit: null,
      unitOfValue,
      value: Number.parseFloat(numberPart) * bareSiPrefixMultiplier,
    }
  }

  if (
    bareSiPrefixMultiplier != null &&
    !unitMappingAndVariantSuffixes.has(unit)
  ) {
    return {
      parsedUnit: null,
      unitOfValue: null,
      value: Number.parseFloat(numberPart) * bareSiPrefixMultiplier,
    }
  }

  const { baseUnit, conversionFactor } = getBaseTscircuitUnit(unit)

  return {
    parsedUnit: unit,
    unitOfValue: baseUnit,
    value: conversionFactor * Number.parseFloat(numberPart),
  }
}
