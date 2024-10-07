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
      Ω: 1,
      kΩ: 1e3,
      MΩ: 1e6,
      GΩ: 1e9,
      TΩ: 1e12,
    },
  },
  V: {
    baseUnit: "V",
    variants: {
      mV: 1e-3,
      V: 1,
      kV: 1e3,
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
      mF: 1e-3,
      F: 1,
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

function getBaseTscircuitUnit(unit: string): UnitInfo {
  for (const [baseUnit, info] of Object.entries(unitMappings)) {
    if (unit in info.variants) {
      return {
        baseUnit: info.baseUnit,
        conversionFactor: info.variants[unit]!,
      }
    }
  }
  return {
    baseUnit: unit as BaseTscircuitUnit,
    conversionFactor: 1,
  }
}

const si_prefix_multiplier = {
  tera: 1e12,
  T: 1e12,
  giga: 1e9,
  G: 1e9,
  mega: 1e6,
  M: 1e6,
  kilo: 1e3,
  k: 1e3,
  deci: 1e-1,
  d: 1e-1,
  centi: 1e-2,
  c: 1e-2,
  milli: 1e-3,
  m: 1e-3,
  micro: 1e-6,
  u: 1e-6,
  µ: 1e-6,
  nano: 1e-9,
  n: 1e-9,
  pico: 1e-12,
  p: 1e-12,
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

export const parseAndConvertSiUnit = <
  T extends
    | string
    | number
    | undefined
    | { x: string | number; y: string | number },
>(
  v: T,
): {
  parsedUnit: string | null
  unitOfValue: BaseTscircuitUnit | null
  value: T extends { x: string | number; y: string | number }
    ? null | { x: number; y: number }
    : null | number
} => {
  if (typeof v === "undefined")
    return { parsedUnit: null, unitOfValue: null, value: null }
  if (typeof v === "string" && v.match(/^[\d\.]+$/))
    return {
      value: Number.parseFloat(v) as any,
      parsedUnit: null,
      unitOfValue: null,
    }
  if (typeof v === "number")
    return { value: v as any, parsedUnit: null, unitOfValue: null }
  if (typeof v === "object" && "x" in v && "y" in v) {
    const { parsedUnit, unitOfValue } = parseAndConvertSiUnit(v.x)
    return {
      parsedUnit: parsedUnit,
      unitOfValue: unitOfValue,
      value: {
        x: parseAndConvertSiUnit(v.x as any).value as number,
        y: parseAndConvertSiUnit(v.y as any).value as number,
      } as any,
    }
  }
  const unit_reversed = v
    .split("")
    .reverse()
    .join("")
    .match(/[a-zA-Z]+/)?.[0]
  if (!unit_reversed) {
    throw new Error(`Could not determine unit: "${v}"`)
  }
  const unit = unit_reversed.split("").reverse().join("")
  const value = v.slice(0, -unit.length)

  const { baseUnit, conversionFactor } = getBaseTscircuitUnit(unit)

  return {
    parsedUnit: unit,
    unitOfValue: baseUnit,
    value: (conversionFactor * Number.parseFloat(value)) as any,
  }
}
