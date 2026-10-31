import { z } from "zod"
import { base_circuit_json_error } from "../base_circuit_json_error"
import { getZodPrefixedIdWithDefault, point } from "../common"
import { layer_string } from "./properties/layer_ref"

export const pcb_clearance_error = base_circuit_json_error.extend({
  type: z.literal("pcb_clearance_error"),
  pcb_clearance_error_id: getZodPrefixedIdWithDefault("pcb_clearance_error"),
  error_type: z.literal("pcb_clearance_error"),
  rule_name: z.string(),
  pcb_element_ids: z.array(z.string()),
  layer: layer_string.optional(),
  minimum_clearance: z.number().finite().nonnegative().optional(),
  actual_clearance: z.number().finite().nonnegative().optional(),
  center: point.optional(),
})

/** A scoped copper rule violation, or an explicit inability to verify it. */
export type PcbClearanceError = z.infer<typeof pcb_clearance_error>
