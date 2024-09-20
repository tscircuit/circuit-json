import { z } from "zod"
import { distance, type Distance } from "src/units"
import { getZodPrefixedIdWithDefault } from "src/utils/get-zod-prefixed-id-with-default"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_hole = z.union([
  z.object({
    type: z.literal("pcb_hole"),
    hole_shape: z
      .enum(["circle", "square", "round"])
      .default("circle")
      .transform((shape) => {
        if (shape === "round") return "circle"
        return shape as "circle" | "square"
      }),
    hole_diameter: z.number(),
    x: distance,
    y: distance,
  }),
  z.object({
    type: z.literal("pcb_hole"),
    pcb_hole_id: getZodPrefixedIdWithDefault("pcb_hole"),
    hole_shape: z.literal("oval"),
    hole_width: z.number(),
    hole_height: z.number(),
    x: distance,
    y: distance,
  }),
])

export type PcbHoleInput = z.input<typeof pcb_hole>
type InferredPcbHole = z.infer<typeof pcb_hole>

/**
 * Defines a hole on the PCB
 */
export interface PcbHole {
  type: "pcb_hole"
  pcb_hole_id: string
  hole_shape: "round" | "square" | "oval"
  hole_diameter?: number
  hole_width?: number
  hole_height?: number
  x: Distance
  y: Distance
}

/**
 * @deprecated use PcbHole
 */
export type PCBHole = PcbHole

expectTypesMatch<PcbHole, InferredPcbHole>(true)
