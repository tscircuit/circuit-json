import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { distance, type Distance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_keepout = z.union([
  z.object({
    type: z.literal("pcb_keepout"),
    shape: z.literal("rect"),
    pcb_keepout_id: getZodPrefixedIdWithDefault("pcb_keepout"),
    center: point,
    width: distance,
    height: distance,
    layers: z.array(z.string()), // Specify layers where the keepout applies
    description: z.string().optional(), // Optional description of the keepout
  }),
  z.object({
    type: z.literal("pcb_keepout"),
    shape: z.literal("circle"),
    pcb_keepout_id: getZodPrefixedIdWithDefault("pcb_keepout"),
    center: point,
    radius: distance,
    layers: z.array(z.string()), // Specify layers where the keepout applies
    description: z.string().optional(), // Optional description of the keepout
  }),
])

export type PcbKeepoutInput = z.input<typeof pcb_keepout>
type InferredPcbKeepout = z.infer<typeof pcb_keepout>

/**
 * Defines a keepout area on the PCB, which can be either a rectangle or a circle.
 * The keepout area is specified for one or more layers, and an optional description can be provided.
 */
export interface PcbKeepout {
  type: "pcb_keepout"
  pcb_keepout_id: string
  center: Point
  layers: string[]
  description?: string
}

// Rectangular Keepout
export interface PcbKeepoutRect extends PcbKeepout {
  shape: "rect"
  width: Distance
  height: Distance
}

// Circular Keepout
export interface PcbKeepoutCircle extends PcbKeepout {
  shape: "circle"
  radius: Distance
}

/**
 * @deprecated use PcbKeepout
 */
export type PCBKeepout = PcbKeepout

expectTypesMatch<PcbKeepout, InferredPcbKeepout>(true)
