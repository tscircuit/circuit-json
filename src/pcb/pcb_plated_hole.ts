import { z } from "zod"
import { distance, type Distance, rotation, type Rotation } from "src/units"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

const pad_outline = z
  .array(
    z.object({
      x: distance,
      y: distance,
    }),
  )
  .min(3)

const pad_stackup_circle = z.object({
  type: z.literal("circle"),
  outer_diameter: z.number(),
})

const pad_stackup_rect = z.object({
  type: z.literal("rect"),
  width: z.number(),
  height: z.number(),
  border_radius: z.number().optional(),
  ccw_rotation: rotation.optional(),
})

const pad_stackup_oval = z.object({
  type: z.literal("oval"),
  width: z.number(),
  height: z.number(),
  ccw_rotation: rotation.optional(),
})

const pad_stackup_pill = z.object({
  type: z.literal("pill"),
  width: z.number(),
  height: z.number(),
  ccw_rotation: rotation.optional(),
})

const pad_stackup_rotated_pill = z.object({
  type: z.literal("rotated_pill"),
  width: z.number(),
  height: z.number(),
  ccw_rotation: rotation,
})

const pad_stackup_polygon = z.object({
  type: z.literal("polygon"),
  pad_outline,
})

const pad_stackup_shape = z.discriminatedUnion("type", [
  pad_stackup_circle,
  pad_stackup_rect,
  pad_stackup_oval,
  pad_stackup_pill,
  pad_stackup_rotated_pill,
  pad_stackup_polygon,
])

const pad_stackup_layer = z.object({
  layer: layer_ref,
  shape: pad_stackup_shape,
})

const pcb_plated_hole_circle = z.object({
  type: z.literal("pcb_plated_hole"),
  shape: z.literal("circle"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  outer_diameter: z.number(),
  hole_diameter: z.number(),
  is_covered_with_solder_mask: z.boolean().optional(),
  x: distance,
  y: distance,
  layers: z.array(layer_ref),
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  pcb_plated_hole_id: getZodPrefixedIdWithDefault("pcb_plated_hole"),
  soldermask_margin: z.number().optional(),
})

export interface PcbPadStackupCircle {
  type: "circle"
  outer_diameter: number
}

export interface PcbPadStackupRect {
  type: "rect"
  width: number
  height: number
  border_radius?: number
  ccw_rotation?: Rotation
}

export interface PcbPadStackupOval {
  type: "oval"
  width: number
  height: number
  ccw_rotation?: Rotation
}

export interface PcbPadStackupPill {
  type: "pill"
  width: number
  height: number
  ccw_rotation?: Rotation
}

export interface PcbPadStackupRotatedPill {
  type: "rotated_pill"
  width: number
  height: number
  ccw_rotation: Rotation
}

export interface PcbPadStackupPolygon {
  type: "polygon"
  pad_outline: { x: Distance; y: Distance }[]
}

export type PcbPadStackupShape =
  | PcbPadStackupCircle
  | PcbPadStackupRect
  | PcbPadStackupOval
  | PcbPadStackupPill
  | PcbPadStackupRotatedPill
  | PcbPadStackupPolygon

export interface PcbPadStackupLayer {
  layer: LayerRef
  shape: PcbPadStackupShape
}

export type PcbPadStackup = PcbPadStackupLayer[]

/**
 * Defines a circular plated hole on the PCB
 */
export interface PcbPlatedHoleCircle {
  type: "pcb_plated_hole"
  shape: "circle"
  pcb_group_id?: string
  subcircuit_id?: string
  outer_diameter: number
  hole_diameter: number
  is_covered_with_solder_mask?: boolean
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id: string
  soldermask_margin?: number
}

const pcb_plated_hole_oval = z.object({
  type: z.literal("pcb_plated_hole"),
  shape: z.enum(["oval", "pill"]),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  outer_width: z.number(),
  outer_height: z.number(),
  hole_width: z.number(),
  hole_height: z.number(),
  is_covered_with_solder_mask: z.boolean().optional(),
  x: distance,
  y: distance,
  ccw_rotation: rotation,
  layers: z.array(layer_ref),
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  pcb_plated_hole_id: getZodPrefixedIdWithDefault("pcb_plated_hole"),
  soldermask_margin: z.number().optional(),
})

/**
 * Defines an oval or pill-shaped plated hole on the PCB
 */
export interface PcbPlatedHoleOval {
  type: "pcb_plated_hole"
  shape: "oval" | "pill"
  pcb_group_id?: string
  subcircuit_id?: string
  outer_width: number
  outer_height: number
  hole_width: number
  hole_height: number
  is_covered_with_solder_mask?: boolean
  x: Distance
  y: Distance
  ccw_rotation: Rotation
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id: string
  soldermask_margin?: number
}

const pcb_circular_hole_with_rect_pad = z.object({
  type: z.literal("pcb_plated_hole"),
  shape: z.literal("circular_hole_with_rect_pad"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  hole_shape: z.literal("circle"),
  pad_shape: z.literal("rect"),
  hole_diameter: z.number(),
  rect_pad_width: z.number(),
  rect_pad_height: z.number(),
  rect_border_radius: z.number().optional(),
  hole_offset_x: distance.default(0),
  hole_offset_y: distance.default(0),
  is_covered_with_solder_mask: z.boolean().optional(),
  x: distance,
  y: distance,
  layers: z.array(layer_ref),
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  pcb_plated_hole_id: getZodPrefixedIdWithDefault("pcb_plated_hole"),
  soldermask_margin: z.number().optional(),
})
const pcb_pill_hole_with_rect_pad = z.object({
  type: z.literal("pcb_plated_hole"),
  shape: z.literal("pill_hole_with_rect_pad"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  hole_shape: z.literal("pill"),
  pad_shape: z.literal("rect"),
  hole_width: z.number(),
  hole_height: z.number(),
  rect_pad_width: z.number(),
  rect_pad_height: z.number(),
  rect_border_radius: z.number().optional(),
  hole_offset_x: distance.default(0),
  hole_offset_y: distance.default(0),
  is_covered_with_solder_mask: z.boolean().optional(),
  x: distance,
  y: distance,
  layers: z.array(layer_ref),
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  pcb_plated_hole_id: getZodPrefixedIdWithDefault("pcb_plated_hole"),
  soldermask_margin: z.number().optional(),
})
const pcb_rotated_pill_hole_with_rect_pad = z.object({
  type: z.literal("pcb_plated_hole"),
  shape: z.literal("rotated_pill_hole_with_rect_pad"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  hole_shape: z.literal("rotated_pill"),
  pad_shape: z.literal("rect"),
  hole_width: z.number(),
  hole_height: z.number(),
  hole_ccw_rotation: rotation,
  rect_pad_width: z.number(),
  rect_pad_height: z.number(),
  rect_border_radius: z.number().optional(),
  rect_ccw_rotation: rotation,
  hole_offset_x: distance.default(0),
  hole_offset_y: distance.default(0),
  is_covered_with_solder_mask: z.boolean().optional(),
  x: distance,
  y: distance,
  layers: z.array(layer_ref),
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  pcb_plated_hole_id: getZodPrefixedIdWithDefault("pcb_plated_hole"),
  soldermask_margin: z.number().optional(),
})
export interface PcbHolePillWithRectPad {
  type: "pcb_plated_hole"
  shape: "pill_hole_with_rect_pad"
  pcb_group_id?: string
  subcircuit_id?: string
  hole_shape: "pill"
  pad_shape: "rect"
  hole_width: number
  hole_height: number
  rect_pad_width: number
  rect_pad_height: number
  rect_border_radius?: number
  hole_offset_x: Distance
  hole_offset_y: Distance
  is_covered_with_solder_mask?: boolean
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id: string
  soldermask_margin?: number
}

export interface PcbHoleRotatedPillWithRectPad {
  type: "pcb_plated_hole"
  shape: "rotated_pill_hole_with_rect_pad"
  pcb_group_id?: string
  subcircuit_id?: string
  hole_shape: "rotated_pill"
  pad_shape: "rect"
  hole_width: number
  hole_height: number
  hole_ccw_rotation: Rotation
  rect_pad_width: number
  rect_pad_height: number
  rect_border_radius?: number
  rect_ccw_rotation: Rotation
  hole_offset_x: Distance
  hole_offset_y: Distance
  is_covered_with_solder_mask?: boolean
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id: string
  soldermask_margin?: number
}

export interface PcbHoleCircularWithRectPad {
  type: "pcb_plated_hole"
  shape: "circular_hole_with_rect_pad"
  pcb_group_id?: string
  subcircuit_id?: string
  hole_shape: "circle"
  pad_shape: "rect"
  hole_diameter: number
  rect_pad_width: number
  rect_pad_height: number
  rect_border_radius?: number
  hole_offset_x: Distance
  hole_offset_y: Distance
  is_covered_with_solder_mask?: boolean
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id: string
  soldermask_margin?: number
}
const pcb_hole_with_polygon_pad = z.object({
  type: z.literal("pcb_plated_hole"),
  shape: z.literal("hole_with_polygon_pad"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  hole_shape: z.enum(["circle", "oval", "pill", "rotated_pill"]),
  hole_diameter: z.number().optional(),
  hole_width: z.number().optional(),
  hole_height: z.number().optional(),

  pad_outline,

  hole_offset_x: distance.default(0),
  hole_offset_y: distance.default(0),
  is_covered_with_solder_mask: z.boolean().optional(),
  x: distance,
  y: distance,
  layers: z.array(layer_ref),
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  pcb_plated_hole_id: getZodPrefixedIdWithDefault("pcb_plated_hole"),
  soldermask_margin: z.number().optional(),
  ccw_rotation: rotation.optional(),
})

const pcb_hole_with_pad_stackup = z
  .object({
    type: z.literal("pcb_plated_hole"),
    shape: z.literal("hole_with_pad_stackup"),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    hole_shape: z.enum(["circle", "oval", "pill", "rotated_pill"]),
    hole_diameter: z.number().optional(),
    hole_width: z.number().optional(),
    hole_height: z.number().optional(),
    hole_ccw_rotation: rotation.optional(),
    pad_stackup: z.array(pad_stackup_layer).min(1),
    hole_offset_x: distance.default(0),
    hole_offset_y: distance.default(0),
    x: distance,
    y: distance,
    layers: z.array(layer_ref),
    port_hints: z.array(z.string()).optional(),
    pcb_component_id: z.string().optional(),
    pcb_port_id: z.string().optional(),
    pcb_plated_hole_id: getZodPrefixedIdWithDefault("pcb_plated_hole"),
  })
  .superRefine((value, ctx) => {
    if (value.hole_shape === "circle") {
      if (value.hole_diameter === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["hole_diameter"],
          message: "hole_diameter is required when hole_shape is circle",
        })
      }
    } else {
      if (value.hole_width === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["hole_width"],
          message: "hole_width is required when hole_shape is not circle",
        })
      }
      if (value.hole_height === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["hole_height"],
          message: "hole_height is required when hole_shape is not circle",
        })
      }
    }

    if (
      value.hole_shape === "rotated_pill" &&
      value.hole_ccw_rotation === undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["hole_ccw_rotation"],
        message:
          "hole_ccw_rotation is required when hole_shape is rotated_pill",
      })
    }
  })

/**
 * Defines a plated hole with a polygonal pad on the PCB
 */

export interface PcbHoleWithPolygonPad {
  type: "pcb_plated_hole"
  shape: "hole_with_polygon_pad"
  pcb_group_id?: string
  subcircuit_id?: string
  hole_shape: "circle" | "oval" | "pill" | "rotated_pill"
  hole_diameter?: number
  hole_width?: number
  hole_height?: number
  pad_outline: { x: Distance; y: Distance }[]
  hole_offset_x: Distance
  hole_offset_y: Distance
  is_covered_with_solder_mask?: boolean
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id: string
  soldermask_margin?: number
  ccw_rotation?: Rotation
}

export interface PcbHoleWithPadStackup {
  type: "pcb_plated_hole"
  shape: "hole_with_pad_stackup"
  pcb_group_id?: string
  subcircuit_id?: string
  hole_shape: "circle" | "oval" | "pill" | "rotated_pill"
  hole_diameter?: number
  hole_width?: number
  hole_height?: number
  hole_ccw_rotation?: Rotation
  pad_stackup: PcbPadStackup
  hole_offset_x: Distance
  hole_offset_y: Distance
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id: string
}

export const pcb_plated_hole = z.union([
  pcb_plated_hole_circle,
  pcb_plated_hole_oval,
  pcb_circular_hole_with_rect_pad,
  pcb_pill_hole_with_rect_pad,
  pcb_rotated_pill_hole_with_rect_pad,
  pcb_hole_with_polygon_pad,
  pcb_hole_with_pad_stackup,
])
export type PcbPlatedHole =
  | PcbPlatedHoleCircle
  | PcbPlatedHoleOval
  | PcbHoleCircularWithRectPad
  | PcbHolePillWithRectPad
  | PcbHoleRotatedPillWithRectPad
  | PcbHoleWithPolygonPad
  | PcbHoleWithPadStackup

expectTypesMatch<PcbPadStackupCircle, z.infer<typeof pad_stackup_circle>>(true)
expectTypesMatch<PcbPadStackupRect, z.infer<typeof pad_stackup_rect>>(true)
expectTypesMatch<PcbPadStackupOval, z.infer<typeof pad_stackup_oval>>(true)
expectTypesMatch<PcbPadStackupPill, z.infer<typeof pad_stackup_pill>>(true)
expectTypesMatch<
  PcbPadStackupRotatedPill,
  z.infer<typeof pad_stackup_rotated_pill>
>(true)
expectTypesMatch<PcbPadStackupPolygon, z.infer<typeof pad_stackup_polygon>>(
  true,
)
expectTypesMatch<PcbPadStackupShape, z.infer<typeof pad_stackup_shape>>(true)
expectTypesMatch<PcbPadStackupLayer, z.infer<typeof pad_stackup_layer>>(true)
expectTypesMatch<PcbPadStackup, z.infer<typeof pad_stackup_layer>[]>(true)
expectTypesMatch<PcbPlatedHoleCircle, z.infer<typeof pcb_plated_hole_circle>>(
  true,
)
expectTypesMatch<PcbPlatedHoleOval, z.infer<typeof pcb_plated_hole_oval>>(true)
expectTypesMatch<
  PcbHoleCircularWithRectPad,
  z.infer<typeof pcb_circular_hole_with_rect_pad>
>(true)
expectTypesMatch<
  PcbHolePillWithRectPad,
  z.infer<typeof pcb_pill_hole_with_rect_pad>
>(true)
expectTypesMatch<
  PcbHoleRotatedPillWithRectPad,
  z.infer<typeof pcb_rotated_pill_hole_with_rect_pad>
>(true)
expectTypesMatch<
  PcbHoleWithPolygonPad,
  z.infer<typeof pcb_hole_with_polygon_pad>
>(true)
expectTypesMatch<
  PcbHoleWithPadStackup,
  z.infer<typeof pcb_hole_with_pad_stackup>
>(true)
/**
 * @deprecated use PcbPlatedHole
 */
export type PCBPlatedHole = PcbPlatedHole

/**
 * @deprecated use PcbPlatedHoleInput
 */
export type PCBPlatedHoleInput = z.input<typeof pcb_plated_hole>
export type PcbPlatedHoleInput = z.input<typeof pcb_plated_hole>
