import { z } from "zod"
import { distance } from "../units"
import { layer_ref } from "./properties/layer_ref"

export const pcb_plated_hole = z
  .object({
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
  })
  .object({
    type: z.literal("pcb_plated_hole"),
    shape: z.literal("oval"),
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
  })
  .describe("Defines a plated hole on the PCB")

export type PCBPlatedHoleInput = z.input<typeof pcb_plated_hole>
export type PCBPlatedHole = z.infer<typeof pcb_plated_hole>
