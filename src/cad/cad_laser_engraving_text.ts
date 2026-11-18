import { z } from "zod"
import { point3, type Point3 } from "../common"
import {
  ninePointAnchor,
  type NinePointAnchor,
} from "../common/NinePointAnchor"
import { distance } from "../units"
import { expectTypesMatch } from "../utils/expect-types-match"

// Rigid transforms can introduce small floating-point errors in unit directions.
const FRAME_TOLERANCE = 1e-6
const unitDirection = z
  .object({
    x: z.number().finite(),
    y: z.number().finite(),
    z: z.number().finite(),
  })
  .refine(
    (v) => Math.abs(Math.hypot(v.x, v.y, v.z) - 1) <= FRAME_TOLERANCE,
    "Laser engraving directions must be unit vectors",
  )

export const cad_laser_engraving_text = z
  .object({
    type: z.literal("cad_laser_engraving_text"),
    cad_laser_engraving_text_id: z.string().min(1),
    source_laser_engraving_text_id: z
      .string()
      .min(1)
      .describe(
        "The source record for the engraving this geometry draws: its name and manufacturing detail.",
      ),
    source_component_id: z
      .string()
      .min(1)
      .describe("Source component ID of the part that is engraved."),
    cad_component_id: z
      .string()
      .min(1)
      .optional()
      .describe(
        "CAD geometry the mark sits on. Omit when the part has no CAD component.",
      ),
    cad_reference_surface_id: z
      .string()
      .min(1)
      .optional()
      .describe(
        "Named reference surface the mark was placed on. Omit for a built-in surface such as the part's top. Informational: the frame below is already resolved.",
      ),
    text: z
      .string()
      .refine((value) => value.trim().length > 0, "Text must not be blank")
      .describe("The engraved text, on a single line."),
    font: z.literal("tscircuit2024").default("tscircuit2024"),
    font_size: distance
      .pipe(z.number().finite().positive())
      .describe("Text height in millimeters."),
    anchor_position: point3
      .refine(
        (p) => [p.x, p.y, p.z].every(Number.isFinite),
        "Laser engraving anchor positions must be finite",
      )
      .describe(
        "Resolved anchor point on the part surface in right-handed circuit-world XYZ, millimeters: +X right, +Y top, +Z above. An absolute point after assembly placement.",
      ),
    anchor_alignment: ninePointAnchor
      .default("center")
      .describe(
        "The point of the text's bounding box that sits at anchor_position.",
      ),
    normal_direction: unitDirection.describe(
      "Outward unit normal of the engraved surface in circuit-world XYZ. The text is read from this side. Dimensionless direction; transform with the part's rotation, without translation.",
    ),
    x_axis_direction: unitDirection.describe(
      "Unit direction the text reads along in circuit-world XYZ, perpendicular to normal_direction. Any rotation on the surface is already applied. The text's up direction is normal_direction cross x_axis_direction.",
    ),
    color: z
      .string()
      .trim()
      .min(1)
      .optional()
      .describe(
        "Color the engraved area is drawn in. Omit to let the renderer derive it from the part.",
      ),
    subcircuit_id: z.string().optional(),
  })
  .superRefine((engraving, ctx) => {
    const { normal_direction: n, x_axis_direction: x } = engraving
    if (Math.abs(n.x * x.x + n.y * x.y + n.z * x.z) > FRAME_TOLERANCE)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["x_axis_direction"],
        message: "x_axis_direction must be perpendicular to normal_direction",
      })
  })
  .describe(
    "The 3D geometry of text laser engraved onto one surface of an assembly part, with a resolved world-space frame. The producer resolves the surface and placement; renderers consume the frame without reapplying the owning model's transform. What is engraved and how is in the linked source_laser_engraving_text.",
  )

export type CadLaserEngravingTextInput = z.input<
  typeof cad_laser_engraving_text
>

/** The 3D geometry of text laser engraved onto one surface of a part, in
 * right-handed circuit world: +X right, +Y top, +Z above. anchor_position is
 * an absolute point in mm; normal_direction and x_axis_direction are
 * dimensionless, perpendicular unit directions, within 1e-6 numerical
 * tolerance. The text lies in the plane through anchor_position perpendicular
 * to normal_direction, reads along x_axis_direction, and its up direction is
 * normal_direction cross x_axis_direction. font_size is the text height in mm.
 * color adds no default when omitted.
 */
export interface CadLaserEngravingText {
  type: "cad_laser_engraving_text"
  cad_laser_engraving_text_id: string
  source_laser_engraving_text_id: string
  source_component_id: string
  cad_component_id?: string
  cad_reference_surface_id?: string
  text: string
  font: "tscircuit2024"
  font_size: number
  anchor_position: Point3
  anchor_alignment: NinePointAnchor
  normal_direction: Point3
  x_axis_direction: Point3
  color?: string
  subcircuit_id?: string
}

expectTypesMatch<
  CadLaserEngravingText,
  z.infer<typeof cad_laser_engraving_text>
>(true)
