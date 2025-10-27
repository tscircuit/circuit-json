# Circuit JSON Specification: Schematic Component Overview

> Created at 2024-10-23T22:29:08.481Z
> Latest Version: https://github.com/tscircuit/circuit-json/blob/main/docs/SCHEMATIC_COMPONENT_OVERVIEW.md

Any type below can be imported from `circuit-json`. Every type has a corresponding
snake_case version which is a zod type that can be used to parse unknown json,
for example `SchematicComponent` has a `schematic_component.parse` function that you
can also import.

```ts
interface SchematicTrace {
  type: "schematic_trace"
  schematic_trace_id: string
  source_trace_id?: string
  subcircuit_connectivity_map_key?: string // will be required in future
  edges: Array<{
    from: {
      x: number
      y: number
    }
    to: {
      x: number
      y: number
    }
    from_schematic_port_id?: string
    to_schematic_port_id?: string
  }>
}

interface SchematicBox {
  type: "schematic_box"
  schematic_component_id?: string
  width: number
  height: number
  x: number
  y: number
}

interface SchematicSheet {
  type: "schematic_sheet"
  schematic_sheet_id: string
  name?: string
  subcircuit_id?: string
}

interface SchematicLine {
  type: "schematic_line"
  schematic_line_id: string
  schematic_component_id: string
  x1: number
  x2: number
  y1: number
  y2: number
  stroke_width: number
  color: string
  is_dashed: boolean
  subcircuit_id?: string
}

interface SchematicError {
  schematic_error_id: string
  type: "schematic_error"
  error_type: "schematic_port_not_found"
  message: string
}

interface SchematicComponent {
  type: "schematic_component"
  rotation: number
  size: { width: number; height: number }
  center: { x: number; y: number }
  source_component_id: string
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
  port_arrangement?:
    | {
        left_size: number
        right_size: number
        top_size?: number
        bottom_size?: number
      }
    | {
        left_side?: {
          pins: number[]
          direction?: "top-to-bottom" | "bottom-to-top"
        }
        right_side?: {
          pins: number[]
          direction?: "top-to-bottom" | "bottom-to-top"
        }
        top_side?: {
          pins: number[]
          direction?: "left-to-right" | "right-to-left"
        }
        bottom_side?: {
          pins: number[]
          direction?: "left-to-right" | "right-to-left"
        }
      }
  port_labels?: Record<string, string>
  is_box_with_pins: boolean
}

interface SchematicDebugRect {
  type: "schematic_debug_object"
  label?: string
  shape: "rect"
  center: { x: number; y: number }
  size: { width: number; height: number }
}

interface SchematicDebugLine {
  type: "schematic_debug_object"
  label?: string
  shape: "line"
  start: { x: number; y: number }
  end: { x: number; y: number }
}

type SchematicDebugObject = SchematicDebugRect | SchematicDebugLine

interface SchematicPort {
  type: "schematic_port"
  schematic_port_id: string
  source_port_id: string
  schematic_component_id?: string
  center: { x: number; y: number }
  facing_direction?: "up" | "down" | "left" | "right"
}

interface SchematicNetLabel {
  type: "schematic_net_label"
  source_net_id: string
  center: { x: number; y: number }
  anchor_side: "top" | "bottom" | "left" | "right"
  text: string
  is_movable?: boolean
}

interface SchematicPath {
  type: "schematic_path"
  schematic_component_id: string
  fill_color?: "red" | "blue"
  is_filled?: boolean
  points: Array<{ x: number; y: number }>
}

interface SchematicText {
  type: "schematic_text"
  schematic_component_id: string
  schematic_text_id: string
  text: string
  position: {
    x: number
    y: number
  }
  rotation: number
  anchor: "center" | "left" | "right" | "top" | "bottom"
}
```
