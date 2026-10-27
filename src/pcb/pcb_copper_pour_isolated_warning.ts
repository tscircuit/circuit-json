import { z } from "zod"
import { getZodPrefixedIdWithDefault, point, type Point } from "src/common"
import { layer_ref, type LayerRef } from "./properties/layer_ref"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_copper_pour_isolated_warning = z
  .object({
    type: z.literal("pcb_copper_pour_isolated_warning"),
    pcb_copper_pour_isolated_warning_id: getZodPrefixedIdWithDefault(
      "pcb_copper_pour_isolated_warning",
    ),
    warning_type: z
      .literal("pcb_copper_pour_isolated_warning")
      .default("pcb_copper_pour_isolated_warning"),
    message: z.string(),
    pcb_copper_pour_id: z.string(),
    source_net_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    layer: layer_ref,
    center: point,
  })
  .describe(
    "Warning for an isolated PCB copper pour without a same-net pad or via connection",
  )

export type PcbCopperPourIsolatedWarningInput = z.input<
  typeof pcb_copper_pour_isolated_warning
>
type InferredPcbCopperPourIsolatedWarning = z.infer<
  typeof pcb_copper_pour_isolated_warning
>

/** An isolated copper pour, with its original reference and location. */
export interface PcbCopperPourIsolatedWarning {
  type: "pcb_copper_pour_isolated_warning"
  pcb_copper_pour_isolated_warning_id: string
  warning_type: "pcb_copper_pour_isolated_warning"
  message: string
  pcb_copper_pour_id: string
  source_net_id?: string
  subcircuit_id?: string
  layer: LayerRef
  /** Approximate island location in board-world millimeters. */
  center: Point
}

expectTypesMatch<
  PcbCopperPourIsolatedWarning,
  InferredPcbCopperPourIsolatedWarning
>(true)
