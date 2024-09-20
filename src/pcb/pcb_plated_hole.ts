import { z } from "zod"
import { distance, type Distance } from "src/units"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_plated_hole = z.union([
  z.object({
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
  }),
  z.object({
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
  }),
])
  .describe("Defines a plated hole on the PCB")

export type PcbPlatedHoleInput = z.input<typeof pcb_plated_hole>
type InferredPcbPlatedHole = z.infer<typeof pcb_plated_hole>

/**
 * Defines a plated hole on the PCB
 */
export interface PcbPlatedHole {
  type: "pcb_plated_hole"
  shape: "circle" | "oval" | "pill"
  outer_diameter?: number
  outer_width?: number
  outer_height?: number
  hole_diameter?: number
  hole_width?: number
  hole_height?: number
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id: string
}

/**
 * @deprecated use PcbPlatedHole
 */
export type PCBPlatedHole = PcbPlatedHole

/**
 * @deprecated use PcbPlatedHoleInput
 */
export type PCBPlatedHoleInput = PcbPlatedHoleInput

expectTypesMatch<PcbPlatedHole, InferredPcbPlatedHole>(true)
