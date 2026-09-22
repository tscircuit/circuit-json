import { type Point, getZodPrefixedIdWithDefault, point } from "src/common"
import { type Length, type Rotation, length, rotation } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

const finite_point = point.extend({
  x: length.pipe(z.number().finite()),
  y: length.pipe(z.number().finite()),
})

export const pcb_bend = z
  .object({
    type: z.literal("pcb_bend"),
    pcb_bend_id: getZodPrefixedIdWithDefault("pcb_bend"),
    pcb_board_id: z.string(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    name: z.string().optional(),
    start: finite_point,
    end: finite_point,
    bend_angle: rotation.pipe(z.number().finite()),
    bend_radius: length.pipe(z.number().finite().positive()),
    bend_side: z.enum(["left", "right"]),
  })
  .refine(({ start, end }) => start.x !== end.x || start.y !== end.y, {
    message: "Bend centerline endpoints must be distinct",
    path: ["end"],
  })
  .describe(
    "Defines a finite-radius bend on a flat PCB for runtime CAD folding",
  )

export type PcbBendInput = z.input<typeof pcb_bend>
type InferredPcbBend = z.infer<typeof pcb_bend>

/** Defines a bend without changing the flat PCB layout or stored CAD poses. */
export interface PcbBend {
  type: "pcb_bend"
  pcb_bend_id: string
  pcb_board_id: string
  /** Ownership only; group transforms are already resolved into board coordinates. */
  pcb_group_id?: string
  subcircuit_id?: string
  name?: string
  /** Bend-zone centerline endpoints, relative to the flat board center, in mm. */
  start: Point
  end: Point
  /** Target angle in signed degrees; positive folds the moving side toward local top. Zero is flat. */
  bend_angle: Rotation
  /** Positive radius at the neutral surface, in mm. Zone width is radius times absolute angle in radians. */
  bend_radius: Length
  /** Moving side looking from start toward end in the flat top view. */
  bend_side: "left" | "right"
}

expectTypesMatch<PcbBend, InferredPcbBend>(true)
