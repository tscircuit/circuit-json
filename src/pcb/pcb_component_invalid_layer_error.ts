import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_component_invalid_layer_error = z
  .object({
    type: z.literal("pcb_component_invalid_layer_error"),
    pcb_component_invalid_layer_error_id: getZodPrefixedIdWithDefault(
      "pcb_component_invalid_layer_error",
    ),
    error_type: z
      .literal("pcb_component_invalid_layer_error")
      .default("pcb_component_invalid_layer_error"),
    message: z.string(),
    pcb_component_id: z.string().optional(),
    source_component_id: z.string(),
    layer: layer_ref,
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Error emitted when a component is placed on an invalid layer (components can only be on 'top' or 'bottom' layers)",
  )

export type PcbComponentInvalidLayerErrorInput = z.input<
  typeof pcb_component_invalid_layer_error
>
type InferredPcbComponentInvalidLayerError = z.infer<
  typeof pcb_component_invalid_layer_error
>

/** Error emitted when a component is placed on an invalid layer (components can only be on 'top' or 'bottom' layers) */
export interface PcbComponentInvalidLayerError {
  type: "pcb_component_invalid_layer_error"
  pcb_component_invalid_layer_error_id: string
  error_type: "pcb_component_invalid_layer_error"
  message: string
  pcb_component_id?: string
  source_component_id: string
  layer: LayerRef
  subcircuit_id?: string
}

expectTypesMatch<
  PcbComponentInvalidLayerError,
  InferredPcbComponentInvalidLayerError
>(true)
