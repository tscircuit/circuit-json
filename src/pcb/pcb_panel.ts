import { z } from "zod"
import { getZodPrefixedIdWithDefault, point, type Point } from "src/common"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_panel = z
  .object({
    type: z.literal("pcb_panel"),
    pcb_panel_id: getZodPrefixedIdWithDefault("pcb_panel"),
    width: length,
    height: length,
    center: point,
    covered_with_solder_mask: z.boolean().optional().default(true),
    layout_mode: z.enum(["none", "grid"]).optional(),
  })
  .describe("Defines a PCB panel that can contain multiple boards")

/**
 * Defines a PCB panel that can contain multiple boards
 */
export interface PcbPanel {
  type: "pcb_panel"
  pcb_panel_id: string
  width: Length
  height: Length
  center: Point
  covered_with_solder_mask: boolean
  layout_mode?: "none" | "grid"
}

export type PcbPanelInput = z.input<typeof pcb_panel>
type InferredPcbPanel = z.infer<typeof pcb_panel>

/**
 * @deprecated use PcbPanel
 */
export type PCBPanel = PcbPanel

expectTypesMatch<PcbPanel, InferredPcbPanel>(true)
