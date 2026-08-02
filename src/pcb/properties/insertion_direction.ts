import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

/**
 * The direction a cable or mating part is attached from, named for the side of
 * the board it approaches from.
 *
 * This names a side, not a motion. A receptacle on the +Y edge of the board is
 * `from_top` because that is the side the plug comes from, even though the plug
 * itself moves in -Y as it seats.
 *
 * Names follow the tscircuit 2D convention, i.e. the board as drawn in the PCB
 * view: `top` is +Y, `bottom` is -Y, `left` is -X and `right` is +X. The Z axis
 * uses `above` for +Z and `below` for -Z so that it never collides with the
 * `top`/`bottom` used for the Y axis. Note that this is unrelated to the
 * `layer` field, where "top" and "bottom" name copper layers rather than
 * directions.
 *
 * Every name has an equivalent Cartesian spelling (`"from_y_pos"` and
 * friends). The two are interchangeable on input; parsing normalizes the
 * Cartesian spellings to the named ones, so a parsed `insertion_direction` is
 * always one of the six named values.
 */
export type InsertionDirection =
  | "from_left"
  | "from_right"
  | "from_top"
  | "from_bottom"
  | "from_above"
  | "from_below"

/**
 * Cartesian spellings accepted as input for {@link InsertionDirection}.
 *
 * Spelled `_pos`/`_neg` rather than `+`/`-` because Circuit JSON enum values
 * must be snake_case (see `scripts/zod-lint.ts`).
 */
export type InsertionDirectionCartesian =
  | "from_x_neg"
  | "from_x_pos"
  | "from_y_pos"
  | "from_y_neg"
  | "from_z_pos"
  | "from_z_neg"

/**
 * Spellings retained only so that existing Circuit JSON and existing sources
 * keep parsing. They normalize to the canonical values on input and are never
 * produced by parsing.
 *
 * @deprecated `from_front` named +Y and `from_back` named -Y, which read as if
 * they described a 3D viewport rather than the board as drawn in the 2D PCB
 * view. Use `from_top` and `from_bottom`. Remove these once no published
 * package still emits them.
 */
export type InsertionDirectionDeprecated = "from_front" | "from_back"

export type InsertionDirectionInput =
  | InsertionDirection
  | InsertionDirectionCartesian
  | InsertionDirectionDeprecated

/**
 * Maps each accepted spelling to the canonical named value.
 */
export const insertionDirectionToCanonical = {
  from_left: "from_left",
  from_right: "from_right",
  from_top: "from_top",
  from_bottom: "from_bottom",
  from_above: "from_above",
  from_below: "from_below",
  from_x_neg: "from_left",
  from_x_pos: "from_right",
  from_y_pos: "from_top",
  from_y_neg: "from_bottom",
  from_z_pos: "from_above",
  from_z_neg: "from_below",
  /** @deprecated use `from_top` */
  from_front: "from_top",
  /** @deprecated use `from_bottom` */
  from_back: "from_bottom",
} as const satisfies Record<InsertionDirectionInput, InsertionDirection>

/**
 * The unit vector each canonical direction points along, in board coordinates.
 */
export const insertionDirectionToVector = {
  from_left: { x: -1, y: 0, z: 0 },
  from_right: { x: 1, y: 0, z: 0 },
  from_top: { x: 0, y: 1, z: 0 },
  from_bottom: { x: 0, y: -1, z: 0 },
  from_above: { x: 0, y: 0, z: 1 },
  from_below: { x: 0, y: 0, z: -1 },
} as const satisfies Record<
  InsertionDirection,
  { x: number; y: number; z: number }
>

export const insertion_direction = z
  .enum([
    "from_left",
    "from_right",
    "from_top",
    "from_bottom",
    "from_above",
    "from_below",
    "from_x_neg",
    "from_x_pos",
    "from_y_pos",
    "from_y_neg",
    "from_z_pos",
    "from_z_neg",
    // Deprecated, accepted so existing Circuit JSON keeps parsing.
    "from_front",
    "from_back",
  ])
  .transform((value) => insertionDirectionToCanonical[value])
  .describe(
    'The side exposing the receptacle where the cable or mating part is attached, following the 2D PCB diagram convention, not a 3D viewport frame. In project coordinate space, "from_top" is +Y, "from_bottom" -Y, "from_left" -X, "from_right" +X, "from_above" +Z and "from_below" -Z. A receptacle on the +Y edge is "from_top" even though the plug moves in -Y as it seats. Cartesian spellings such as "from_y_pos" are accepted and normalized to the named values, as are the deprecated "from_front" (now "from_top") and "from_back" (now "from_bottom").',
  )

expectTypesMatch<InsertionDirection, z.infer<typeof insertion_direction>>(true)
expectTypesMatch<InsertionDirectionInput, z.input<typeof insertion_direction>>(
  true,
)
