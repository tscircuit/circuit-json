import { z } from "zod"
import { getZodPrefixedIdWithDefault, point, type Point } from "src/common"
import { layer_ref, type LayerRef } from "./properties/layer_ref"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_copper_pour_style_warning = z
  .object({
    type: z.literal("pcb_copper_pour_style_warning"),
    pcb_copper_pour_style_warning_id: getZodPrefixedIdWithDefault(
      "pcb_copper_pour_style_warning",
    ),
    warning_type: z
      .literal("pcb_copper_pour_style_warning")
      .default("pcb_copper_pour_style_warning"),
    message: z.string(),
    styling_issue_type: z.literal("isolated_island"),
    pcb_copper_pour_id: z.string(),
    source_net_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    layer: layer_ref,
    center: point,
  })
  .describe(
    "Advisory PCB copper pour style warning for an isolated copper island",
  )

export type PcbCopperPourStyleWarningInput = z.input<
  typeof pcb_copper_pour_style_warning
>
type InferredPcbCopperPourStyleWarning = z.infer<
  typeof pcb_copper_pour_style_warning
>

/** Advisory pour style issue, with the original copper reference and location. */
export interface PcbCopperPourStyleWarning {
  type: "pcb_copper_pour_style_warning"
  pcb_copper_pour_style_warning_id: string
  warning_type: "pcb_copper_pour_style_warning"
  message: string
  styling_issue_type: "isolated_island"
  pcb_copper_pour_id: string
  source_net_id?: string
  subcircuit_id?: string
  layer: LayerRef
  /** Approximate island location in board-world millimeters. */
  center: Point
}

expectTypesMatch<PcbCopperPourStyleWarning, InferredPcbCopperPourStyleWarning>(
  true,
)
