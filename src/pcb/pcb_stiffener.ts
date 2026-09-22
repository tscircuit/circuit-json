import { type Point, getZodPrefixedIdWithDefault, point } from "src/common"
import { type Length, type Rotation, length, rotation } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

const positive_length = length.pipe(z.number().finite().positive())
const finite_point = point.extend({
  x: length.pipe(z.number().finite()),
  y: length.pipe(z.number().finite()),
})

const pcb_stiffener_base = z.object({
  type: z.literal("pcb_stiffener"),
  pcb_stiffener_id: getZodPrefixedIdWithDefault("pcb_stiffener"),
  pcb_board_id: z.string(),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  name: z.string().optional(),
  layer: z.enum(["top", "bottom"]),
  material: z.enum(["fr4", "polyimide", "stainless_steel", "aluminum"]),
  thickness: positive_length,
  adhesive_thickness: length.pipe(z.number().finite().nonnegative()).optional(),
})

/** Common properties of bonded PCB reinforcement. */
export interface PcbStiffenerBase {
  type: "pcb_stiffener"
  pcb_stiffener_id: string
  pcb_board_id: string
  /** Ownership only; geometry is already resolved into board coordinates. */
  pcb_group_id?: string
  subcircuit_id?: string
  name?: string
  /** Attachment face, not an additional copper layer. */
  layer: "top" | "bottom"
  material: "fr4" | "polyimide" | "stainless_steel" | "aluminum"
  /** Material thickness in mm, excluding the PCB and adhesive. */
  thickness: Length
  /** Adhesive thickness in mm; omission means unspecified, not zero. */
  adhesive_thickness?: Length
}

export const pcb_stiffener_rect = pcb_stiffener_base.extend({
  shape: z.literal("rect"),
  center: finite_point,
  rotation: rotation.pipe(z.number().finite()).optional(),
  width: positive_length,
  height: positive_length,
  outline: z.never().optional(),
})

export type PcbStiffenerRectInput = z.input<typeof pcb_stiffener_rect>
/** A rectangular reinforcement bonded to one face of the PCB. */
export interface PcbStiffenerRect extends PcbStiffenerBase {
  shape: "rect"
  /** Relative to the flat board center, in mm. */
  center: Point
  /** Degrees counterclockwise in the flat top view; omission means zero. */
  rotation?: Rotation
  width: Length
  height: Length
  outline?: never
}
expectTypesMatch<PcbStiffenerRect, z.infer<typeof pcb_stiffener_rect>>(true)

export const pcb_stiffener_polygon = pcb_stiffener_base.extend({
  shape: z.literal("polygon"),
  outline: z
    .array(finite_point)
    .min(3)
    .refine((points) => {
      const twice_area = points.reduce((sum, p, i) => {
        const next = points[(i + 1) % points.length]!
        return sum + p.x * next.y - next.x * p.y
      }, 0)
      return Number.isFinite(twice_area) && twice_area !== 0
    }, "Stiffener outline must enclose a nonzero area"),
  center: z.never().optional(),
  rotation: z.never().optional(),
  width: z.never().optional(),
  height: z.never().optional(),
})

export type PcbStiffenerPolygonInput = z.input<typeof pcb_stiffener_polygon>
/** A polygonal reinforcement with resolved flat-board geometry. */
export interface PcbStiffenerPolygon extends PcbStiffenerBase {
  shape: "polygon"
  /** Implicitly closed vertices relative to the flat board center, in mm. All placement/rotation is baked in. */
  outline: Point[]
  center?: never
  rotation?: never
  width?: never
  height?: never
}
expectTypesMatch<PcbStiffenerPolygon, z.infer<typeof pcb_stiffener_polygon>>(
  true,
)

export const pcb_stiffener = z
  .discriminatedUnion("shape", [pcb_stiffener_rect, pcb_stiffener_polygon])
  .describe(
    "Defines bonded mechanical PCB reinforcement without adding copper layers",
  )

export type PcbStiffenerInput = z.input<typeof pcb_stiffener>
export type PcbStiffener = PcbStiffenerRect | PcbStiffenerPolygon
expectTypesMatch<PcbStiffener, z.infer<typeof pcb_stiffener>>(true)
