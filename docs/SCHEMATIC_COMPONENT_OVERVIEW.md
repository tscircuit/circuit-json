# Circuit JSON Specification: Schematic Component Overview

> Created at 2025-01-22T00:01:52.582Z
> Latest Version: https://github.com/tscircuit/circuit-json/blob/main/docs/SCHEMATIC_COMPONENT_OVERVIEW.md

Any type below can be imported from `circuit-json`. Every type has a corresponding
snake_case version which is a zod type that can be used to parse unknown json,
for example `SchematicComponent` has a `schematic_component.parse` function that you
can also import.

```ts
interface SchematicTraceEdge {
  from: {
    x: number
    y: number
  }
  to: {
    x: number
    y: number
  }
  is_crossing?: boolean
  from_schematic_port_id?: string
  to_schematic_port_id?: string
}

interface SchematicTrace {
  type: "schematic_trace"
  schematic_trace_id: string
  source_trace_id: string
  junctions: {
    x: number
    y: number
  }[]
  edges: SchematicTraceEdge[]
}

interface SchematicBox {
  type: "schematic_box"
  schematic_component_id: string
  width: number
  height: number
  x: number
  y: number
}

interface SchematicLine {
  type: "schematic_line"
  schematic_component_id: string
  x1: number
  x2: number
  y1: number
  y2: number
}

interface SchematicError {
  type: "schematic_error"
  schematic_error_id: string
  error_type: "schematic_port_not_found"
  message: string
}

interface SchematicPortArrangementBySize {
  left_size: number
  right_size: number
  top_size?: number
  bottom_size?: number
}

interface SchematicPortArrangementBySides {
  left_side?: { pins: number[]; direction?: "top-to-bottom" | "bottom-to-top" }
  right_side?: { pins: number[]; direction?: "top-to-bottom" | "bottom-to-top" }
  top_side?: { pins: number[]; direction?: "left-to-right" | "right-to-left" }
  bottom_side?: {
    pins: number[]
    direction?: "left-to-right" | "right-to-left"
  }
}

type SchematicPortArrangement =
  | SchematicPortArrangementBySize
  | SchematicPortArrangementBySides

interface SchematicComponent {
  type: "schematic_component"
  rotation: number
  size: Size
  center: Point
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
  port_arrangement?: SchematicPortArrangement
  port_labels?: Record<string, string>
  symbol_display_value?: string
}

interface SchematicDebugRect {
  type: "schematic_debug_object"
  label?: string
  shape: "rect"
  center: Point
  size: Size
}

interface SchematicDebugLine {
  type: "schematic_debug_object"
  label?: string
  shape: "line"
  start: Point
  end: Point
}

interface SchematicDebugPoint {
  type: "schematic_debug_object"
  label?: string
  shape: "point"
  center: Point
}

type SchematicDebugObject =
  | SchematicDebugRect
  | SchematicDebugLine
  | SchematicDebugPoint

interface SchematicVoltageProbe {
  type: "schematic_voltage_probe"
  schematic_voltage_probe_id: string
  position: Point
  schematic_trace_id: string
  voltage?: number
}

interface SchematicPort {
  type: "schematic_port"
  schematic_port_id: string
  source_port_id: string
  schematic_component_id?: string
  center: Point
  facing_direction?: "up" | "down" | "left" | "right"
  distance_from_component_edge?: number
  side_of_component?: "top" | "bottom" | "left" | "right"
  true_ccw_index?: number
  pin_number?: number
  display_pin_label?: string
}

interface SchematicNetLabel {
  type: "schematic_net_label"
  source_net_id: string
  center: Point
  anchor_position?: Point
  anchor_side: "top" | "bottom" | "left" | "right"
  text: string
  symbol_name?: string
}

interface SchematicPath {
  type: "schematic_path"
  schematic_component_id: string
  fill_color?: "red" | "blue"
  is_filled?: boolean
  points: Point[]
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
  color: string
}

```