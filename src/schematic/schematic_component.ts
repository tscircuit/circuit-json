import { z } from "zod"
import { point, type Point } from "../common/point"
import { size, type Size } from "../common/size"
import { length } from "../units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const schematic_pin_styles = z.record(
  z.object({
    left_margin: length.optional(),
    right_margin: length.optional(),
    top_margin: length.optional(),
    bottom_margin: length.optional(),
  }),
)

export interface SchematicPortArrangementBySize {
  left_size: number
  right_size: number
  top_size?: number
  bottom_size?: number
}

export type SchematicPortArrangementPin = number | string

export interface SchematicPortArrangementBySides {
  left_side?: {
    pins: SchematicPortArrangementPin[]
    direction?: "top-to-bottom" | "bottom-to-top"
  }
  right_side?: {
    pins: SchematicPortArrangementPin[]
    direction?: "top-to-bottom" | "bottom-to-top"
  }
  top_side?: {
    pins: SchematicPortArrangementPin[]
    direction?: "left-to-right" | "right-to-left"
  }
  bottom_side?: {
    pins: SchematicPortArrangementPin[]
    direction?: "left-to-right" | "right-to-left"
  }
}

export type SchematicPortArrangement =
  | SchematicPortArrangementBySize
  | SchematicPortArrangementBySides

export type SchematicPinArrangement = SchematicPortArrangement

export interface SchematicComponent {
  type: "schematic_component"
  size: Size
  center: Point
  source_component_id?: string
  schematic_component_id: string
  pin_spacing?: number
  pin_styles?: Record<
    string,
    {
      left_margin?: number
      right_margin?: number
      top_margin?: number
      bottom_margin?: number
    }
  >
  box_width?: number
  symbol_name?: string
  /** @deprecated use schematic_pin_arrangement */
  port_arrangement?: SchematicPortArrangement
  schematic_pin_arrangement?: SchematicPinArrangement
  port_labels?: Record<string, string>
  symbol_display_value?: string
  subcircuit_id?: string
  schematic_group_id?: string
  is_schematic_group?: boolean
  source_group_id?: string
  schematic_box_port_alias_map?: Record<string, string>
  is_box_with_pins: boolean
}

export const schematic_component_port_arrangement_by_size = z.object({
  left_size: z.number(),
  right_size: z.number(),
  top_size: z.number().optional(),
  bottom_size: z.number().optional(),
})

expectTypesMatch<
  SchematicPortArrangementBySize,
  z.infer<typeof schematic_component_port_arrangement_by_size>
>(true)

const schematic_port_arrangement_pin = z.union([z.number(), z.string()])

export const schematic_component_port_arrangement_by_sides = z.object({
  left_side: z
    .object({
      pins: z.array(schematic_port_arrangement_pin),
      // @ts-ignore
      direction: z.enum(["top-to-bottom", "bottom-to-top"]).optional(),
    })
    .optional(),
  right_side: z
    .object({
      pins: z.array(schematic_port_arrangement_pin),
      // @ts-ignore
      direction: z.enum(["top-to-bottom", "bottom-to-top"]).optional(),
    })
    .optional(),
  top_side: z
    .object({
      pins: z.array(schematic_port_arrangement_pin),
      // @ts-ignore
      direction: z.enum(["left-to-right", "right-to-left"]).optional(),
    })
    .optional(),
  bottom_side: z
    .object({
      pins: z.array(schematic_port_arrangement_pin),
      // @ts-ignore
      direction: z.enum(["left-to-right", "right-to-left"]).optional(),
    })
    .optional(),
})

expectTypesMatch<
  SchematicPortArrangementBySides,
  z.infer<typeof schematic_component_port_arrangement_by_sides>
>(true)

export const schematic_pin_arrangement = z.union([
  schematic_component_port_arrangement_by_size,
  schematic_component_port_arrangement_by_sides,
])

export const port_arrangement = schematic_pin_arrangement

export const schematic_component = z.object({
  type: z.literal("schematic_component"),
  size,
  center: point,
  source_component_id: z.string().optional(),
  schematic_component_id: z.string(),
  pin_spacing: length.optional(),
  pin_styles: schematic_pin_styles.optional(),
  box_width: length.optional(),
  symbol_name: z.string().optional(),
  port_arrangement: schematic_pin_arrangement.optional(),
  schematic_pin_arrangement: schematic_pin_arrangement.optional(),
  port_labels: z.record(z.string()).optional(),
  symbol_display_value: z.string().optional(),
  subcircuit_id: z.string().optional(),
  schematic_group_id: z.string().optional(),
  is_schematic_group: z.boolean().optional(),
  source_group_id: z.string().optional(),
  schematic_box_port_alias_map: z.record(z.string()).optional(),
  is_box_with_pins: z.boolean().optional().default(true),
})

export type SchematicComponentInput = z.input<typeof schematic_component>
type InferredSchematicComponent = z.infer<typeof schematic_component>

expectTypesMatch<SchematicComponent, InferredSchematicComponent>(true)
