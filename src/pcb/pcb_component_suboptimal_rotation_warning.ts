import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { rotation, type Rotation } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

const finiteRotation = rotation.pipe(z.number().finite())
const crossingCount = z.number().finite().int().nonnegative()

const rotationCandidate = z.object({
  rotation: finiteRotation,
  crossing_count: crossingCount,
})

/** A candidate absolute PCB rotation and its pairwise airwire crossing count.
 * Rotation is in degrees, CCW about +Z in the board-world frame (+X right,
 * +Y up, +Z above; right-handed), holding the placed component center fixed. */
export interface PcbComponentRotationCandidate {
  rotation: Rotation
  crossing_count: number
}

export const pcb_component_suboptimal_rotation_warning = z
  .object({
    type: z.literal("pcb_component_suboptimal_rotation_warning"),
    pcb_component_suboptimal_rotation_warning_id: getZodPrefixedIdWithDefault(
      "pcb_component_suboptimal_rotation_warning",
    ),
    warning_type: z
      .literal("pcb_component_suboptimal_rotation_warning")
      .default("pcb_component_suboptimal_rotation_warning"),
    message: z.string(),
    pcb_component_id: z.string(),
    source_component_id: z.string().optional(),
    pcb_board_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    evaluation_method: z
      .literal("airwire_crossings")
      .default("airwire_crossings"),
    current_rotation: finiteRotation,
    recommended_rotation: finiteRotation,
    current_crossing_count: crossingCount,
    recommended_crossing_count: crossingCount,
    rotation_candidates: z.array(rotationCandidate).min(1).optional(),
  })
  .describe(
    "Advisory warning that rotating a PCB component could reduce pairwise airwire crossings; this is not a routing or placement feasibility guarantee.",
  )

export type PcbComponentSuboptimalRotationWarningInput = z.input<
  typeof pcb_component_suboptimal_rotation_warning
>

/** Advisory warning that rotating a PCB component could reduce pairwise airwire
 * crossings. Absolute rotations are degrees CCW about +Z in the board-world
 * frame (+X right, +Y up, +Z above; right-handed), holding its placed center
 * fixed. Counts describe the evaluated airwires, not routed copper. Emission
 * thresholds and routing/placement feasibility belong to the producer. */
export interface PcbComponentSuboptimalRotationWarning {
  type: "pcb_component_suboptimal_rotation_warning"
  pcb_component_suboptimal_rotation_warning_id: string
  warning_type: "pcb_component_suboptimal_rotation_warning"
  message: string
  pcb_component_id: string
  source_component_id?: string
  pcb_board_id?: string
  subcircuit_id?: string
  evaluation_method: "airwire_crossings"
  current_rotation: Rotation
  recommended_rotation: Rotation
  current_crossing_count: number
  recommended_crossing_count: number
  rotation_candidates?: PcbComponentRotationCandidate[]
}

expectTypesMatch<
  PcbComponentRotationCandidate,
  z.infer<typeof rotationCandidate>
>(true)
expectTypesMatch<
  PcbComponentSuboptimalRotationWarning,
  z.infer<typeof pcb_component_suboptimal_rotation_warning>
>(true)
