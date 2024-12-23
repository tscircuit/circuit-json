import { z } from "zod"
import { distance, type Distance } from "src/units"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

const pcb_plated_hole_circle = z.object({
  type: z.literal("pcb_plated_hole"),
  shape: z.literal("circle"),
  outer_diameter: z.number(),
  hole_diameter: z.number(),
  x: distance,
  y: distance,
  layers: z.array(layer_ref),
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  pcb_plated_hole_id: getZodPrefixedIdWithDefault("pcb_plated_hole"),
})

/**
 * Defines a circular plated hole on the PCB
 */
export interface PcbPlatedHoleCircle {
  type: "pcb_plated_hole"
  shape: "circle"
  outer_diameter: number
  hole_diameter: number
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id: string
}

const pcb_plated_hole_oval = z.object({
  type: z.literal("pcb_plated_hole"),
  shape: z.enum(["oval", "pill"]),
  outer_width: z.number(),
  outer_height: z.number(),
  hole_width: z.number(),
  hole_height: z.number(),
  x: distance,
  y: distance,
  layers: z.array(layer_ref),
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  pcb_plated_hole_id: getZodPrefixedIdWithDefault("pcb_plated_hole"),
})

/**
 * Defines an oval or pill-shaped plated hole on the PCB
 */
export interface PcbPlatedHoleOval {
  type: "pcb_plated_hole"
  shape: "oval" | "pill"
  outer_width: number
  outer_height: number
  hole_width: number
  hole_height: number
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id: string
}

const pcb_circular_hole_with_square_plate = z.object({
  type: z.literal("pcb_plated_hole"),
  shape: z.literal("square"),
  hole_diameter: z.number(),
  square_pad_width: z.number(),
  square_pad_height: z.number(),
  x: distance,
  y: distance,
  layers: z.array(layer_ref),
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  pcb_plated_hole_id: getZodPrefixedIdWithDefault("pcb_plated_hole"),
})

export interface PcbHoleCircularWithSquarePlated {
  type: "pcb_plated_hole"
  shape: "square"
  hole_diameter: number
  square_pad_width: number
  square_pad_height: number
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
  pcb_circular_hole_with_square_plate,
])
export type PcbPlatedHole =
  | PcbPlatedHoleCircle
  | PcbPlatedHoleOval
  | PcbHoleCircularWithSquarePlated

expectTypesMatch<PcbPlatedHoleCircle, z.infer<typeof pcb_plated_hole_circle>>(
  true,
)
expectTypesMatch<PcbPlatedHoleOval, z.infer<typeof pcb_plated_hole_oval>>(true)
expectTypesMatch<
  PcbHoleCircularWithSquarePlated,
  z.infer<typeof pcb_circular_hole_with_square_plate>
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
