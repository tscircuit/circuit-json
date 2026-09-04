import { z } from "zod"
import { point, type Point } from "../common"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** A contiguous part of a schematic pin label that shares the same styling. */
export interface SchematicTextRun {
  /** The literal text displayed for this part of the label. */
  text: string
  /** Draw a line above this text, typically indicating an active-low signal. */
  overline?: boolean
}

export interface SchematicPort {
  type: "schematic_port"
  schematic_port_id: string
  source_port_id: string
  schematic_sheet_id?: string
  schematic_component_id?: string
  center: Point
  facing_direction?: "up" | "down" | "left" | "right"
  distance_from_component_edge?: number
  side_of_component?: "top" | "bottom" | "left" | "right"
  true_ccw_index?: number
  pin_number?: number
  display_pin_label?: string
  /**
   * Ordered parts of the pin label with per-part styling.
   * For example, `A~{BC}D` is represented as `A`, overlined `BC`, then `D`.
   * Consumers that do not support styled text can use `display_pin_label`.
   */
  display_pin_label_text_runs?: SchematicTextRun[]
  display_pin_label_font_size?: number
  subcircuit_id?: string
  is_connected?: boolean
  is_internal_circuit_port?: boolean
  is_overlapping_internal_circuit_port?: boolean
  has_input_arrow?: boolean
  has_output_arrow?: boolean
  is_drawn_with_inversion_circle?: boolean
}

export const schematic_port = z
  .object({
    type: z.literal("schematic_port"),
    schematic_port_id: z.string(),
    source_port_id: z.string(),
    schematic_sheet_id: z.string().optional(),
    schematic_component_id: z.string().optional(),
    center: point,
    facing_direction: z.enum(["up", "down", "left", "right"]).optional(),
    distance_from_component_edge: z.number().optional(),
    side_of_component: z.enum(["top", "bottom", "left", "right"]).optional(),
    true_ccw_index: z.number().optional(),
    pin_number: z.number().optional(),
    display_pin_label: z.string().optional(),
    display_pin_label_text_runs: z
      .array(
        z.object({
          text: z.string(),
          overline: z.boolean().optional(),
        }),
      )
      .min(1)
      .optional(),
    display_pin_label_font_size: z.number().positive().finite().optional(),
    subcircuit_id: z.string().optional(),
    is_connected: z.boolean().optional(),
    is_internal_circuit_port: z.boolean().optional(),
    is_overlapping_internal_circuit_port: z.boolean().optional(),
    has_input_arrow: z.boolean().optional(),
    has_output_arrow: z.boolean().optional(),
    is_drawn_with_inversion_circle: z.boolean().optional(),
  })
  .describe("Defines a port on a schematic component")

export type SchematicPortInput = z.input<typeof schematic_port>
type InferredSchematicPort = z.infer<typeof schematic_port>

expectTypesMatch<SchematicPort, InferredSchematicPort>(true)
