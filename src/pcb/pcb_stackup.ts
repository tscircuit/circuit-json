import { getZodPrefixedIdWithDefault } from "src/common"
import { type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"
import {
  type PcbSoldermaskStackupLayer,
  pcb_stackup_soldermask_layer,
} from "./pcb_stackup/soldermask_layer"
import {
  type PcbCopperStackupLayer,
  pcb_stackup_copper_layer,
} from "./pcb_stackup/copper_layer"
import {
  type PcbDielectricStackupLayer,
  pcb_stackup_dielectric_layer,
} from "./pcb_stackup/dielectric_layer"
import { positive_length } from "./pcb_stackup/validators"

export * from "./pcb_stackup/soldermask_layer"
export * from "./pcb_stackup/copper_layer"
export * from "./pcb_stackup/dielectric_layer"

export const pcb_stackup_layer = z.discriminatedUnion("layer_type", [
  pcb_stackup_soldermask_layer,
  pcb_stackup_copper_layer,
  pcb_stackup_dielectric_layer,
])

export type PcbStackupLayer =
  | PcbSoldermaskStackupLayer
  | PcbCopperStackupLayer
  | PcbDielectricStackupLayer
expectTypesMatch<PcbStackupLayer, z.infer<typeof pcb_stackup_layer>>(true)

export const pcb_stackup = z
  .object({
    type: z.literal("pcb_stackup").describe("PCB stackup element"),
    pcb_stackup_id:
      getZodPrefixedIdWithDefault("pcb_stackup").describe("Unique stackup ID"),
    pcb_board_id: z.string().describe("Board described by this stackup"),
    subcircuit_id: z.string().optional().describe("Owning subcircuit ID"),
    nominal_board_thickness: positive_length
      .optional()
      .describe("Nominal finished board thickness in mm"),
    plated_hole_copper_thickness: positive_length
      .optional()
      .describe("Plated hole barrel wall copper thickness in mm"),
    layers: z
      .array(pcb_stackup_layer)
      .min(1)
      .describe("Resolved physical layers ordered from top to bottom"),
  })
  .describe("Resolved PCB construction and material data")

export type PcbStackupInput = z.input<typeof pcb_stackup>

/** Resolved physical PCB construction, ordered from top to bottom. */
export interface PcbStackup {
  type: "pcb_stackup"
  pcb_stackup_id: string
  /** Board described by this stackup. */
  pcb_board_id: string
  /** Owning subcircuit, if any. */
  subcircuit_id?: string
  /** Nominal finished board thickness in mm. */
  nominal_board_thickness?: Length
  /** Plated hole barrel wall copper thickness in mm. */
  plated_hole_copper_thickness?: Length
  /** Resolved physical layers ordered from top to bottom. */
  layers: PcbStackupLayer[]
}
expectTypesMatch<PcbStackup, z.infer<typeof pcb_stackup>>(true)
