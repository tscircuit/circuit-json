import { z } from "zod"

/** ===== Primitives ===== */
export const schematic_symbol_line = z.object({
  kind: z.literal("line"),
  x1: z.number(),
  y1: z.number(),
  x2: z.number(),
  y2: z.number(),
  stroke_width: z.number().optional(), // schematic base units
})

export const schematic_symbol_rect = z.object({
  kind: z.literal("rect"),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  rx: z.number().optional(),
  ry: z.number().optional(),
  stroke_width: z.number().optional(),
  filled: z.boolean().optional(),
})

export const schematic_symbol_circle = z.object({
  kind: z.literal("circle"),
  cx: z.number(),
  cy: z.number(),
  r: z.number(),
  stroke_width: z.number().optional(),
  filled: z.boolean().optional(),
})

export const schematic_symbol_arc = z.object({
  kind: z.literal("arc"),
  cx: z.number(),
  cy: z.number(),
  r: z.number(),
  // degrees; 0° at +X, CCW positive (matches repo's base unit 'deg')
  start_deg: z.number(),
  end_deg: z.number(),
  stroke_width: z.number().optional(),
})

export const schematic_symbol_text = z.object({
  kind: z.literal("text"),
  x: z.number(),
  y: z.number(),
  text: z.string(),
  font_size: z.number().optional(),
  rotate_deg: z.number().optional(),
})

export const schematic_symbol_primitive = z.union([
  schematic_symbol_line,
  schematic_symbol_rect,
  schematic_symbol_circle,
  schematic_symbol_arc,
  schematic_symbol_text,
])

/** ===== Top-level node ===== */
export const schematic_symbol = z.object({
  /** optional canonical/registry name */
  name: z.string().optional(),
  /** viewBox hint in schematic units (optional) */
  width: z.number().optional(),
  height: z.number().optional(),
  primitives: z.array(schematic_symbol_primitive).default([]),
})

/** ===== Types ===== */
export type SchematicSymbolLine = z.infer<typeof schematic_symbol_line>
export type SchematicSymbolRect = z.infer<typeof schematic_symbol_rect>
export type SchematicSymbolCircle = z.infer<typeof schematic_symbol_circle>
export type SchematicSymbolArc = z.infer<typeof schematic_symbol_arc>
export type SchematicSymbolText = z.infer<typeof schematic_symbol_text>
export type SchematicSymbolPrimitive = z.infer<
  typeof schematic_symbol_primitive
>
export type SchematicSymbol = z.infer<typeof schematic_symbol>
