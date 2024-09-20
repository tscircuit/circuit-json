import { z } from "zod"
import { distance } from "../units"

const holeShapeEnum = z.enum(["circle", "square", "round", "oval"])

export const pcb_hole = z
  .object({
    pcb_hole_id: z.string(),
    type: z.literal("pcb_hole"),
    hole_shape: holeShapeEnum.default("circle").transform((shape) => {
      if (shape === "round") return "circle"
      return shape as "circle" | "square" | "oval"
    }),
    hole_diameter: z.number(),
    x: distance,
    y: distance,
  })
  .or(
    z.object({
      pcb_hole_id: z.string(),
      type: z.literal("pcb_hole"),
      hole_shape: z.literal("oval"),
      hole_width: z.number(),
      hole_height: z.number(),
      x: distance,
      y: distance,
    }),
  )
  .describe("Defines a hole on the PCB")

export type PCBHoleInput = z.input<typeof pcb_hole>
export type PCBHole = z.infer<typeof pcb_hole>
