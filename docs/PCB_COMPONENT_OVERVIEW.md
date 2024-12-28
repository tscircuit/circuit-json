# Circuit JSON Specification: PCB Component Overview

> Created at 2024-10-23T22:17:25.274Z
> Latest Version: https://github.com/tscircuit/circuit-json/blob/main/docs/PCB_COMPONENT_OVERVIEW.md

Any type below can be imported from `circuit-json`. Every type has a corresponding
snake_case version which is a zod type that can be used to parse unknown json,
for example `PcbComponent` has a `pcb_component.parse` function that you
can also import.

```ts
export interface PcbFabricationNotePath {
  type: "pcb_fabrication_note_path"
  pcb_fabrication_note_path_id: string
  pcb_component_id: string
  layer: LayerRef
  route: Point[]
  stroke_width: Length
  color?: string
}

export interface PcbComponent {
  type: "pcb_component"
  pcb_component_id: string
  source_component_id: string
  center: Point
  layer: LayerRef
  rotation: Rotation
  width: Length
  height: Length
}

export interface PcbPortNotMatchedError {
  type: "pcb_port_not_matched_error"
  pcb_error_id: string
  message: string
  pcb_component_ids: string[]
}

export interface PcbSolderPasteCircle {
  type: "pcb_solder_paste"
  shape: "circle"
  pcb_solder_paste_id: string
  x: Distance
  y: Distance
  radius: number
  layer: LayerRef
  pcb_component_id?: string
  pcb_smtpad_id?: string
}

export interface PcbSolderPasteRect {
  type: "pcb_solder_paste"
  shape: "rect"
  pcb_solder_paste_id: string
  x: Distance
  y: Distance
  width: number
  height: number
  layer: LayerRef
  pcb_component_id?: string
  pcb_smtpad_id?: string
}

export type PcbSolderPaste = PcbSolderPasteCircle | PcbSolderPasteRect

export interface PcbSilkscreenText {
  type: "pcb_silkscreen_text"
  pcb_silkscreen_text_id: string
  font: "tscircuit2024"
  font_size: Length
  pcb_component_id: string
  text: string
  layer: LayerRef
  is_mirrored?: boolean
  anchor_position: Point
  anchor_alignment:
    | "center"
    | "top_left"
    | "top_right"
    | "bottom_left"
    | "bottom_right"
}

export interface PcbTraceError {
  type: "pcb_trace_error"
  pcb_trace_error_id: string
  error_type: "pcb_trace_error"
  message: string
  center?: Point
  pcb_trace_id: string
  source_trace_id: string
  pcb_component_ids: string[]
  pcb_port_ids: string[]
}

export interface PcbSilkscreenPill {
  type: "pcb_silkscreen_pill"
  pcb_silkscreen_pill_id: string
  pcb_component_id: string
  center: Point
  width: Length
  height: Length
  layer: LayerRef
}

export interface PcbPlatedHoleCircle {
  type: "pcb_plated_hole"
  shape: "circle"
  outer_diameter: number
  hole_diameter: number
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id: string
}

export interface PcbPlatedHoleOval {
  type: "pcb_plated_hole"
  shape: "oval" | "pill"
  outer_width: number
  outer_height: number
  hole_width: number
  hole_height: number
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id: string
}

export interface PcbHoleCircularWithRectPad {
  type: "pcb_plated_hole"
  shape: "circular_hole_with_rect_pad"
  hole_shape: "circle"
  pad_shape: "rect"
  hole_diameter: number
  rect_pad_width: number
  rect_pad_height: number 
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id: string
}

export type PcbPlatedHole = PcbPlatedHoleCircle | PcbPlatedHoleOval | PcbHoleCircularWithRectPad

export interface PcbFabricationNoteText {
  type: "pcb_fabrication_note_text"
  pcb_fabrication_note_text_id: string
  font: "tscircuit2024"
  font_size: Length
  pcb_component_id: string
  text: string
  layer: VisibleLayer
  anchor_position: Point
  anchor_alignment:
    | "center"
    | "top_left"
    | "top_right"
    | "bottom_left"
    | "bottom_right"
  color?: string
}

export interface PcbSilkscreenCircle {
  type: "pcb_silkscreen_circle"
  pcb_silkscreen_circle_id: string
  pcb_component_id: string
  center: Point
  radius: Length
  layer: VisibleLayer
}

export interface PcbSilkscreenPath {
  type: "pcb_silkscreen_path"
  pcb_silkscreen_path_id: string
  pcb_component_id: string
  layer: VisibleLayerRef
  route: Point[]
  stroke_width: Length
}

export interface PcbText {
  type: "pcb_text"
  pcb_text_id: string
  text: string
  center: Point
  layer: LayerRef
  width: Length
  height: Length
  lines: number
  align: "bottom-left"
}

export interface PCBKeepout {
  type: "pcb_keepout"
  shape: "rect" | "circle"
  center: Point
  width?: Distance
  height?: Distance
  radius?: Distance
  pcb_keepout_id: string
  layers: string[]
  description?: string
}

export interface PcbVia {
  type: "pcb_via"
  pcb_via_id: string
  x: Distance
  y: Distance
  outer_diameter: Distance
  hole_diameter: Distance
  layers: LayerRef[]
  pcb_trace_id?: string
}

export interface PcbSilkscreenOval {
  type: "pcb_silkscreen_oval"
  pcb_silkscreen_oval_id: string
  pcb_component_id: string
  center: Point
  radius_x: Distance
  radius_y: Distance
  layer: VisibleLayer
}

export interface PcbPlacementError {
  type: "pcb_placement_error"
  pcb_placement_error_id: string
  message: string
}

export interface PcbPort {
  type: "pcb_port"
  pcb_port_id: string
  source_port_id: string
  pcb_component_id: string
  x: Distance
  y: Distance
  layers: LayerRef[]
}

export interface PcbSmtPadCircle {
  type: "pcb_smtpad"
  shape: "circle"
  pcb_smtpad_id: string
  x: Distance
  y: Distance
  radius: number
  layer: LayerRef
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
}

export interface PcbSmtPadRect {
  type: "pcb_smtpad"
  shape: "rect"
  pcb_smtpad_id: string
  x: Distance
  y: Distance
  width: number
  height: number
  layer: LayerRef
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
}

export type PcbSmtPad = PcbSmtPadCircle | PcbSmtPadRect

export interface PcbSilkscreenLine {
  type: "pcb_silkscreen_line"
  pcb_silkscreen_line_id: string
  pcb_component_id: string
  stroke_width: Distance
  x1: Distance
  y1: Distance
  x2: Distance
  y2: Distance
  layer: VisibleLayer
}

export interface PcbHoleCircleOrSquare {
  type: "pcb_hole"
  pcb_hole_id: string
  hole_shape: "circle" | "square"
  hole_diameter: number
  x: Distance
  y: Distance
}

export interface PcbHoleOval {
  type: "pcb_hole"
  pcb_hole_id: string
  hole_shape: "oval"
  hole_width: number
  hole_height: number
  x: Distance
  y: Distance
}

export type PcbHole = PcbHoleCircleOrSquare | PcbHoleOval

export interface PcbTraceRoutePointWire {
  route_type: "wire"
  x: Distance
  y: Distance
  width: Distance
  start_pcb_port_id?: string
  end_pcb_port_id?: string
  layer: LayerRef
}

export interface PcbTraceRoutePointVia {
  route_type: "via"
  x: Distance
  y: Distance
  from_layer: string
  to_layer: string
}

export type PcbTraceRoutePoint = PcbTraceRoutePointWire | PcbTraceRoutePointVia

export interface PcbTrace {
  type: "pcb_trace"
  source_trace_id?: string
  pcb_component_id?: string
  pcb_trace_id: string
  route_order_index?: number
  route_thickness_mode?: "constant" | "interpolated"
  should_round_corners?: boolean
  route: Array<PcbTraceRoutePoint>
}

export interface PcbBoard {
  type: "pcb_board"
  pcb_board_id: string
  width: Length
  height: Length
  thickness: Length
  num_layers: number
  center: Point
  outline?: Point[]
}

```