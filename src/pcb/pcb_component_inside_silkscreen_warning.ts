import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const pcb_component_inside_silkscreen_warning = z
  .object({
    type: z.literal("pcb_component_inside_silkscreen_warning"),
    pcb_component_inside_silkscreen_warning_id: getZodPrefixedIdWithDefault(
      "pcb_component_inside_silkscreen_warning",
    ),
    warning_type: z
      .literal("pcb_component_inside_silkscreen_warning")
      .default("pcb_component_inside_silkscreen_warning"),
    message: z.string(),
    /**
     * Ordered pair containing the placed component first and the component
     * whose silkscreen bounds contain it second.
     */
    pcb_component_ids: z.tuple([z.string(), z.string()]),
    pcb_board_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Warning emitted when a PCB component is placed inside the silkscreen bounds of another PCB component",
  )

export type PcbComponentInsideSilkscreenWarningInput = z.input<
  typeof pcb_component_inside_silkscreen_warning
>
type InferredPcbComponentInsideSilkscreenWarning = z.infer<
  typeof pcb_component_inside_silkscreen_warning
>

/** Warning emitted when a PCB component is placed inside another component's silkscreen bounds */
export interface PcbComponentInsideSilkscreenWarning {
  type: "pcb_component_inside_silkscreen_warning"
  pcb_component_inside_silkscreen_warning_id: string
  warning_type: "pcb_component_inside_silkscreen_warning"
  message: string
  /** Placed component first, component owning the enclosing silkscreen second */
  pcb_component_ids: [string, string]
  pcb_board_id?: string
  subcircuit_id?: string
}

expectTypesMatch<
  PcbComponentInsideSilkscreenWarning,
  InferredPcbComponentInsideSilkscreenWarning
>(true)
