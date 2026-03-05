import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

const connectorOrientationDirection = z.enum(["x-", "x+", "y+", "y-"])

type ConnectorOrientationDirection = z.infer<
  typeof connectorOrientationDirection
>

export const pcb_connector_not_in_accessible_orientation_warning = z
  .object({
    type: z.literal("pcb_connector_not_in_accessible_orientation_warning"),
    pcb_connector_not_in_accessible_orientation_warning_id:
      getZodPrefixedIdWithDefault(
        "pcb_connector_not_in_accessible_orientation_warning",
      ),
    warning_type: z
      .literal("pcb_connector_not_in_accessible_orientation_warning")
      .default("pcb_connector_not_in_accessible_orientation_warning"),
    message: z.string(),
    pcb_component_id: z.string(),
    source_component_id: z.string().optional(),
    pcb_board_id: z.string().optional(),
    facing_direction: connectorOrientationDirection,
    recommended_facing_direction: connectorOrientationDirection,
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Warning emitted when a connector PCB component is facing inward toward the board and should be reoriented to an outward-facing direction",
  )

export type PcbConnectorNotInAccessibleOrientationWarningInput = z.input<
  typeof pcb_connector_not_in_accessible_orientation_warning
>
type InferredPcbConnectorNotInAccessibleOrientationWarning = z.infer<
  typeof pcb_connector_not_in_accessible_orientation_warning
>

/** Warning emitted when a connector PCB component is facing inward toward the board and should be reoriented */
export interface PcbConnectorNotInAccessibleOrientationWarning {
  type: "pcb_connector_not_in_accessible_orientation_warning"
  pcb_connector_not_in_accessible_orientation_warning_id: string
  warning_type: "pcb_connector_not_in_accessible_orientation_warning"
  message: string
  pcb_component_id: string
  source_component_id?: string
  pcb_board_id?: string
  facing_direction: ConnectorOrientationDirection
  recommended_facing_direction: ConnectorOrientationDirection
  subcircuit_id?: string
}

expectTypesMatch<
  PcbConnectorNotInAccessibleOrientationWarning,
  InferredPcbConnectorNotInAccessibleOrientationWarning
>(true)
