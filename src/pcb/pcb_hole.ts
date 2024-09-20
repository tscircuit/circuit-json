import { z } from "zod"
import { distance, type Length, getZodPrefixedIdWithDefault } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_hole = z
  .union([
    z
      .object({
        type: z.literal("pcb_hole"),
        pcb_hole_id: getZodPrefixedIdWithDefault("pcb_hole"),
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
      })
      .describe("Defines a circular or square hole on the PCB"),
    z
      .object({
        type: z.literal("pcb_hole"),
        pcb_hole_id: getZodPrefixedIdWithDefault("pcb_hole"),
        hole_shape: z.literal("oval"),
        hole_width: z.number(),
        hole_height: z.number(),
        x: distance,
        y: distance,
      })
      .describe("Defines an oval hole on the PCB"),
  ])
  .describe("Defines a hole on the PCB")

export type PcbHoleInput = z.input<typeof pcb_hole>
type InferredPcbHole = z.infer<typeof pcb_hole>

/**
 * Defines a hole on the PCB
 */
export interface PcbHole {
  type: "pcb_hole"
  pcb_hole_id: string
  hole_shape: "circle" | "square" | "oval"
  x: Length
  y: Length
}

interface PcbCircularOrSquareHole extends PcbHole {
  hole_shape: "circle" | "square"
  hole_diameter: number
}

interface PcbOvalHole extends PcbHole {
  hole_shape: "oval"
  hole_width: number
  hole_height: number
}

export type PcbHole = PcbCircularOrSquareHole | PcbOvalHole

/**
 * @deprecated use PcbHole
 */
export type PCBHole = PcbHole

expectTypesMatch<PcbHole, InferredPcbHole>(true)
