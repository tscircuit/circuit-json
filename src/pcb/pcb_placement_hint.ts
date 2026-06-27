import { z } from "zod"
import { distance } from "src/units"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

/**
 * A placement hint that tells the autoplacer to position a component near
 * a specific target pin, optionally with a facing pad constraint.
 */
export interface PcbPlacementHint {
  type: "pcb_placement_hint"
  pcb_placement_hint_id: string
  pcb_component_id: string

  /** The target port this component should be placed near */
  target_pcb_port_id: string

  /** The port of this component that should face the target */
  facing_pcb_port_id?: string

  /** Max center-to-center distance in mm. Default: 5mm */
  max_distance?: number

  /** Whether the placer has satisfied this hint */
  is_satisfied?: boolean

  subcircuit_id?: string
}

export const pcb_placement_hint = z
  .object({
    type: z.literal("pcb_placement_hint"),
    pcb_placement_hint_id: getZodPrefixedIdWithDefault("pcb_placement_hint"),
    pcb_component_id: z.string(),
    target_pcb_port_id: z.string(),
    facing_pcb_port_id: z.string().optional(),
    max_distance: distance.optional(),
    is_satisfied: z.boolean().optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "A placement hint that tells the autoplacer to position a component near a specific target pin",
  )

export type PcbPlacementHintInput = z.input<typeof pcb_placement_hint>
type InferredPcbPlacementHint = z.infer<typeof pcb_placement_hint>

expectTypesMatch<PcbPlacementHint, InferredPcbPlacementHint>(true)
