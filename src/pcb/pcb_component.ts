import { type Point, getZodPrefixedIdWithDefault, point } from "src/common"
import {
  type KicadFootprintMetadata,
  kicadFootprintMetadata,
} from "src/common/kicadFootprintMetadata"
import {
  type NinePointAnchor,
  ninePointAnchor,
} from "src/common/NinePointAnchor"
import { type LayerRef, layer_ref } from "src/pcb/properties/layer_ref"
import { type Length, type Rotation, length, rotation } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export interface PcbComponentMetadata {
  kicad_footprint?: KicadFootprintMetadata
}

export const pcb_component = z
  .object({
    type: z.literal("pcb_component"),
    pcb_component_id: getZodPrefixedIdWithDefault("pcb_component"),
    source_component_id: z.string(),
    center: point,
    layer: layer_ref,
    rotation: rotation,
    display_offset_x: z
      .string()
      .optional()
      .describe(
        "How to display the x offset for this part, usually corresponding with how the user specified it",
      ),
    display_offset_y: z
      .string()
      .optional()
      .describe(
        "How to display the y offset for this part, usually corresponding with how the user specified it",
      ),
    width: length,
    height: length,
    do_not_place: z.boolean().optional(),
    is_allowed_to_be_off_board: z.boolean().optional(),
    subcircuit_id: z.string().optional(),
    pcb_group_id: z.string().optional(),
    position_mode: z
      .enum([
        "packed",
        "relative_to_group_anchor",
        "relative_to_another_component",
        "none",
      ])
      .optional(),
    anchor_position: point.optional(),
    anchor_alignment: ninePointAnchor.optional(),
    positioned_relative_to_pcb_group_id: z.string().optional(),
    positioned_relative_to_pcb_board_id: z.string().optional(),
    cable_insertion_center: point.optional(),
    insertion_direction: z
      .enum([
        "from_above",
        "from_left",
        "from_right",
        "from_front",
        "from_back",
      ])
      .optional(),
    metadata: z
      .object({
        kicad_footprint: kicadFootprintMetadata.optional(),
      })
      .optional(),
    obstructs_within_bounds: z
      .boolean()
      .default(true)
      .describe(
        "Does this component take up all the space within its bounds on a layer. This is generally true except for when separated pin headers are being represented by a single component (in which case, chips can be placed between the pin headers) or for tall modules where chips fit underneath",
      ),
    relational_constraints: z
      .object({
        anchor_to: z
          .string()
          .optional()
          .describe(
            "The name of another component that this component should be placed near (soft constraint for auto-placement engines)",
          ),
        max_distance: z
          .number()
          .optional()
          .describe(
            "Maximum allowable Euclidean distance in mm between this component's center and the anchor_to component's center",
          ),
        keep_near: z
          .string()
          .optional()
          .describe(
            "Hint for auto-placement engines to keep this component in the same tile/cluster as the named component",
          ),
      })
      .optional()
      .describe(
        "Soft placement relationships between this component and others, used by auto-placement engines",
      ),
  })
  .describe("Defines a component on the PCB")

export type PcbComponentInput = z.input<typeof pcb_component>
type InferredPcbComponent = z.infer<typeof pcb_component>

/**
 * Defines a component on the PCB
 */
export interface PcbComponent {
  type: "pcb_component"
  pcb_component_id: string
  source_component_id: string
  subcircuit_id?: string
  center: Point
  layer: LayerRef
  rotation: Rotation
  display_offset_x?: string
  display_offset_y?: string
  width: Length
  height: Length
  do_not_place?: boolean
  is_allowed_to_be_off_board?: boolean
  pcb_group_id?: string
  position_mode?:
    | "packed"
    | "relative_to_group_anchor"
    | "relative_to_another_component"
    | "none"
  anchor_position?: Point
  anchor_alignment?: NinePointAnchor
  positioned_relative_to_pcb_group_id?: string
  positioned_relative_to_pcb_board_id?: string
  cable_insertion_center?: Point
  insertion_direction?:
    | "from_above"
    | "from_left"
    | "from_right"
    | "from_front"
    | "from_back"
  metadata?: PcbComponentMetadata
  obstructs_within_bounds: boolean
  relational_constraints?: {
    /**
     * The name of another component that this component should be placed near.
     * Soft constraint for auto-placement engines.
     */
    anchor_to?: string
    /**
     * Maximum allowable Euclidean distance in mm between this component's
     * center and the anchor_to component's center.
     */
    max_distance?: number
    /**
     * Hint for auto-placement engines to keep this component in the same
     * tile or cluster as the named component.
     */
    keep_near?: string
  }
}

/**
 * @deprecated use PcbComponent
 */
export type PCBComponent = PcbComponent

expectTypesMatch<PcbComponent, InferredPcbComponent>(true)
