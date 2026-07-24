import { getZodPrefixedIdWithDefault, type Point, point } from "src/common"
import { type LayerRef, layer_ref } from "src/pcb/properties/layer_ref"
import { type Length, length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const pcb_fabrication_note_path = z
  .object({
    type: z.literal("pcb_fabrication_note_path"),
    pcb_fabrication_note_path_id: getZodPrefixedIdWithDefault(
      "pcb_fabrication_note_path",
    ),
    pcb_component_id: z.string(),
    subcircuit_id: z.string().optional(),
    layer: layer_ref,
    route: z.array(point),
    stroke_width: length,
    color: z.string().optional(),
    /** Identifies how the fabrication path should be interpreted. */
    role: z.enum(["tooling", "copper_cut_fill"]).optional(),
    /** Required when this path replaces a copper trace with a filled cut. */
    replaces_pcb_trace_id: z.string().optional(),
  })
  .superRefine((path, context) => {
    if (path.role === "copper_cut_fill" && !path.replaces_pcb_trace_id) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["replaces_pcb_trace_id"],
        message:
          "Copper cut fill paths must identify the PCB trace they replace",
      })
    }
  })
  .describe(
    "Defines a fabrication path on the PCB for fabricators or assemblers",
  )

export type PcbFabricationNotePathInput = z.input<
  typeof pcb_fabrication_note_path
>
type InferredPcbFabricationNotePath = z.infer<typeof pcb_fabrication_note_path>

/**
 * Defines a fabrication path on the PCB for fabricators or assemblers
 */
export interface PcbFabricationNotePath {
  type: "pcb_fabrication_note_path"
  pcb_fabrication_note_path_id: string
  pcb_component_id: string
  subcircuit_id?: string
  layer: LayerRef
  route: Point[]
  stroke_width: Length
  color?: string
  /** Identifies how the fabrication path should be interpreted. */
  role?: "tooling" | "copper_cut_fill"
  /** Required when this path replaces a copper trace with a filled cut. */
  replaces_pcb_trace_id?: string
}

/**
 * @deprecated use PcbFabricationNotePath
 */
export type PCBFabricationNotePath = PcbFabricationNotePath

expectTypesMatch<PcbFabricationNotePath, InferredPcbFabricationNotePath>(true)
