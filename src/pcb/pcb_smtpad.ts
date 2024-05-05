import { z } from "zod"
import { distance } from "../units"
import { layer_ref } from "./properties/layer_ref"

export const pcb_smtpad = z
  .union([
    z.object({
      pcb_smtpad_id: z.string(),
      type: z.literal("pcb_smtpad"),
      shape: z.literal("circle"),
      x: distance,
      y: distance,
      radius: z.number(),
      layer: layer_ref,
      port_hints: z.array(z.string()).optional(),
      pcb_component_id: z.string().optional(),
      pcb_port_id: z.string().optional(),
    }),
    z.object({
      pcb_smtpad_id: z.string(),
      type: z.literal("pcb_smtpad"),
      shape: z.literal("rect"),
      x: distance,
      y: distance,
      width: z.number(),
      height: z.number(),
      layer: layer_ref,
      port_hints: z.array(z.string()).optional(),
      pcb_component_id: z.string().optional(),
      pcb_port_id: z.string().optional(),
    }),
  ])
  .describe("Defines an SMT pad on the PCB")

export type PCBSMTPadInput = z.input<typeof pcb_smtpad>
export type PCBSMTPad = z.infer<typeof pcb_smtpad>
