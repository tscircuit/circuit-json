import type { AnyCircuitElement, CircuitJson } from "../any_circuit_element"
import {
  LEGACY_SCHEMATIC_LENGTH_UNIT,
  MM_PER_SCHEMATIC_UNIT,
  type SchematicLengthUnit,
} from "./index"

const millimetersPerUnit: Record<SchematicLengthUnit, number> = {
  mm: 1,
  in: 25.4,
  [LEGACY_SCHEMATIC_LENGTH_UNIT]: MM_PER_SCHEMATIC_UNIT,
}

// These scalar fields on schematic drawing records are lengths. In particular,
// sheet_width/height are physical paper dimensions in mm in every document.
const lengths = [
  "x",
  "y",
  "x1",
  "x2",
  "y1",
  "y2",
  "width",
  "height",
  "radius",
  "stroke_width",
  "dash_length",
  "dash_gap",
  "font_size",
  "display_pin_label_font_size",
  "pin_spacing",
  "box_width",
  "distance_from_component_edge",
  "cell_padding",
  "border_width",
] as const

function scaleGeometry(
  element: AnyCircuitElement,
  factor: number,
): AnyCircuitElement {
  const result = { ...element }
  for (const key of lengths) {
    const value = Reflect.get(element, key)
    if (typeof value === "number") Reflect.set(result, key, value * factor)
  }
  const point = <T extends { x: number; y: number }>(p: T) => ({
    ...p,
    x: p.x * factor,
    y: p.y * factor,
  })
  for (const key of [
    "center",
    "position",
    "start",
    "end",
    "anchor_position",
    "boundary_position",
  ] as const) {
    if (key in element) {
      const value = Reflect.get(element, key)
      if (value) Reflect.set(result, key, point(value))
    }
  }
  if (
    (element.type === "schematic_component" ||
      element.type === "schematic_debug_object") &&
    "size" in element
  ) {
    const { width, height } = element.size
    Object.assign(result, {
      size: { ...element.size, width: width * factor, height: height * factor },
    })
  }
  switch (element.type) {
    case "schematic_trace":
      return {
        ...result,
        edges: element.edges.map((e) => ({
          ...e,
          from: point(e.from),
          to: point(e.to),
        })),
        junctions: element.junctions.map(point),
      } as typeof element
    case "schematic_path":
      return {
        ...result,
        points: element.points.map(point),
      } as typeof element
    case "schematic_table":
      return {
        ...result,
        column_widths: element.column_widths.map((w) => w * factor),
        row_heights: element.row_heights.map((h) => h * factor),
      } as typeof element
    case "schematic_component":
      if (element.pin_styles) {
        const styles = Object.entries(element.pin_styles).map(
          ([pin, style]) => [
            pin,
            Object.fromEntries(
              Object.entries(style).map(([key, value]) => [
                key,
                typeof value === "number" ? value * factor : value,
              ]),
            ),
          ],
        )
        Object.assign(result, { pin_styles: Object.fromEntries(styles) })
      }
  }
  return result
}

/**
 * Convert schematic drawing geometry and its subcircuit declarations together.
 * Unmarked geometry uses legacy units. A map changes only the named subcircuits.
 * Origins and +X right/+Y up axes stay fixed. Input records are never mutated.
 */
export function convertSchematicLengthUnits(
  circuit: CircuitJson,
  target: SchematicLengthUnit | ReadonlyMap<string, SchematicLengthUnit>,
): CircuitJson {
  const changes = new Map<
    string,
    { unit: SchematicLengthUnit; factor: number }
  >()
  for (const group of circuit) {
    if (
      group.type !== "source_group" ||
      !group.is_subcircuit ||
      !group.subcircuit_id
    )
      continue
    const from =
      group.default_schematic_length_unit ?? LEGACY_SCHEMATIC_LENGTH_UNIT
    const to =
      typeof target === "string" ? target : target.get(group.subcircuit_id)
    if (
      to &&
      (to !== from ||
        (typeof target !== "string" && !group.default_schematic_length_unit))
    ) {
      changes.set(group.subcircuit_id, {
        unit: to,
        factor: millimetersPerUnit[from] / millimetersPerUnit[to],
      })
    }
  }
  if (!changes.size) return circuit
  return circuit.map((element) => {
    if (!("subcircuit_id" in element) || !element.subcircuit_id) return element
    const change = changes.get(element.subcircuit_id)
    if (!change) return element
    if (element.type === "source_group" && element.is_subcircuit) {
      return { ...element, default_schematic_length_unit: change.unit }
    }
    if (change.factor === 1 || !element.type.startsWith("schematic_"))
      return element
    return scaleGeometry(element, change.factor)
  })
}
