import { z } from "zod"
import { asset, point3, type Asset, type Point3 } from "../common"
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
    "Sticker directions must be unit vectors",
  )
const extent = distance.pipe(z.number().finite().positive())

export const cad_sticker = z
  .object({
    type: z.literal("cad_sticker"),
    cad_sticker_id: z.string().min(1),
    source_component_id: z
      .string()
      .min(1)
      .describe(
        "The sticker's own source component, which carries its name and BOM identity.",
      ),
    applied_to_source_component_id: z
      .string()
      .min(1)
      .optional()
      .describe(
        "Source component of the part whose surface carries the sticker. Consumers that move that part, e.g. in an explosion, move the sticker with it.",
      ),
    center: point3
      .refine(
        (p) => [p.x, p.y, p.z].every(Number.isFinite),
        "Sticker centers must be finite",
      )
      .describe(
        "Center of the sticker's adhesive face, on the surface it is applied to. Right-handed circuit-world XYZ, millimeters: +X right, +Y top, +Z above. An absolute point after assembly placement.",
      ),
    normal: unitDirection.describe(
      "Unit direction the printed face points, away from the surface, in circuit-world XYZ. A dimensionless direction, not a point.",
    ),
    x_axis: unitDirection.describe(
      "In-plane unit direction of the artwork's left-to-right, in circuit-world XYZ, perpendicular to normal. It includes any rotation on the surface. The artwork's bottom-to-top is normal cross x_axis.",
    ),
    width: extent.describe("Sticker extent along x_axis in millimeters."),
    height: extent.describe(
      "Sticker extent along normal cross x_axis in millimeters.",
    ),
    thickness: extent
      .optional()
      .describe(
        "Sticker thickness including adhesive, measured along normal from center, in millimeters. Omission leaves it unspecified.",
      ),
    image_asset: asset
      .optional()
      .describe(
        "Printed artwork, an SVG or raster image, stretched to width by height. Omit for an unprinted sticker.",
      ),
    background_color: z
      .string()
      .trim()
      .min(1)
      .optional()
      .describe(
        "Color of the sticker material, seen wherever the artwork is transparent or absent.",
      ),
    subcircuit_id: z.string().optional(),
  })
  .superRefine((sticker, ctx) => {
    const { normal: n, x_axis: x } = sticker
    if (Math.abs(n.x * x.x + n.y * x.y + n.z * x.z) > FRAME_TOLERANCE)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["x_axis"],
        message: "x_axis must be perpendicular to normal",
      })
  })
  .describe(
    "An adhesive sticker applied to a surface, with a resolved world-space frame. The producer resolves the surface, the position on it and the rotation; renderers consume the world frame without reapplying the owning part's transform.",
  )

export type CadStickerInput = z.input<typeof cad_sticker>

/** An adhesive sticker in right-handed circuit world: +X right, +Y top, +Z
 * above. Center, width, height and thickness are mm. Normal and x_axis are
 * dimensionless, perpendicular unit directions, within 1e-6 numerical
 * tolerance. Seen from outside, looking against normal, the artwork reads left
 * to right along x_axis with its top toward normal cross x_axis.
 */
export interface CadSticker {
  type: "cad_sticker"
  cad_sticker_id: string
  /** The sticker's own source component: name and BOM identity. */
  source_component_id: string
  /** The part whose surface carries the sticker; the sticker moves with it. */
  applied_to_source_component_id?: string
  /** Center of the adhesive face, on the surface the sticker is applied to. */
  center: Point3
  /** Direction the printed face points, away from the surface. */
  normal: Point3
  /** The artwork's left-to-right direction, including rotation on the surface. */
  x_axis: Point3
  width: number
  height: number
  /** Includes adhesive; measured along normal. Unspecified when omitted. */
  thickness?: number
  /** Printed artwork stretched to width by height; omitted when unprinted. */
  image_asset?: Asset
  /** Sticker material color, seen where the artwork is transparent or absent. */
  background_color?: string
  subcircuit_id?: string
}

expectTypesMatch<CadSticker, z.infer<typeof cad_sticker>>(true)
