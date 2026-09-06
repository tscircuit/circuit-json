import { z } from "zod"
import { getZodPrefixedIdWithDefault, point, type Point } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_autorouter_warning = z
  .object({
    type: z.literal("pcb_autorouter_warning"),
    pcb_autorouter_warning_id: getZodPrefixedIdWithDefault(
      "pcb_autorouter_warning",
    ),
    warning_type: z
      .literal("pcb_autorouter_warning")
      .default("pcb_autorouter_warning"),
    message: z.string(),
    connection_name: z.string().optional(),
    pcb_port_ids: z.array(z.string()).optional(),
    center: point
      .optional()
      .describe(
        "Board coordinates in millimeters, with positive X right and positive Y up",
      ),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Non-fatal diagnostic emitted by an autorouter; does not replace errors for unrouted connections",
  )

export type PcbAutorouterWarningInput = z.input<typeof pcb_autorouter_warning>
type InferredPcbAutorouterWarning = z.infer<typeof pcb_autorouter_warning>

/** Non-fatal diagnostic emitted by an autorouter */
export interface PcbAutorouterWarning {
  type: "pcb_autorouter_warning"
  pcb_autorouter_warning_id: string
  warning_type: "pcb_autorouter_warning"
  message: string
  /** The autorouter's connection name, when the diagnostic concerns one connection */
  connection_name?: string
  pcb_port_ids?: string[]
  /** Board coordinates in millimeters, with positive X right and positive Y up */
  center?: Point
  subcircuit_id?: string
}

expectTypesMatch<PcbAutorouterWarning, InferredPcbAutorouterWarning>(true)
