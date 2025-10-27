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
  subcircuit_id?: string
  center: Point
  layer: LayerRef
  rotation: Rotation
  width: Length
  height: Length
  do_not_place?: boolean
  pcb_group_id?: string
  obstructs_within_bounds: boolean
}

export interface PcbPortNotMatchedError {
  type: "pcb_port_not_matched_error"
  pcb_error_id: string
  error_type: "pcb_port_not_matched_error"
  message: string
  pcb_component_ids: string[]
}

export interface PcbPortNotConnectedError {
  type: "pcb_port_not_connected_error"
  pcb_port_not_connected_error_id: string
  error_type: "pcb_port_not_connected_error"
  message: string
  pcb_port_ids: string[]
  pcb_component_ids: string[]
  subcircuit_id?: string
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

export interface PcbCopperText {
  type: "pcb_copper_text"
  pcb_copper_text_id: string
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

export interface PcbTraceMissingError {
  type: "pcb_trace_missing_error"
  pcb_trace_missing_error_id: string
  error_type: "pcb_trace_missing_error"
  message: string
  center?: Point
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
  rect_border_radius?: number
  hole_offset_x: Distance
  hole_offset_y: Distance
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id: string
}

export interface PcbHolePillWithRectPad {
  type: "pcb_plated_hole"
  shape: "pill_hole_with_rect_pad"
  hole_shape: "pill"
  pad_shape: "rect"
  hole_width: number
  hole_height: number
  rect_pad_width: number
  rect_pad_height: number
  rect_border_radius?: number
  hole_offset_x: Distance
  hole_offset_y: Distance
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id: string
}

export interface PcbHoleRotatedPillWithRectPad {
  type: "pcb_plated_hole"
  shape: "rotated_pill_hole_with_rect_pad"
  hole_shape: "rotated_pill"
  pad_shape: "rect"
  hole_width: number
  hole_height: number
  hole_ccw_rotation: Rotation
  rect_pad_width: number
  rect_pad_height: number
  rect_border_radius?: number
  rect_ccw_rotation: Rotation
  hole_offset_x: Distance
  hole_offset_y: Distance
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id: string
}

export type PcbPlatedHole =
  | PcbPlatedHoleCircle
  | PcbPlatedHoleOval
  | PcbHoleCircularWithRectPad
  | PcbHolePillWithRectPad
  | PcbHoleRotatedPillWithRectPad

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

export interface PcbFabricationNoteRect {
  type: "pcb_fabrication_note_rect"
  pcb_fabrication_note_rect_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  center: Point
  width: Length
  height: Length
  layer: VisibleLayer
  stroke_width: Length
  is_filled?: boolean
  has_stroke?: boolean
  is_stroke_dashed?: boolean
  color?: string
}

export interface PcbNoteDimension {
  type: "pcb_note_dimension"
  pcb_note_dimension_id: string
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
  name?: string
  from: Point
  to: Point
  text?: string
  text_ccw_rotation?: number
  font: "tscircuit2024"
  font_size: Length
  color?: string
  arrow_size: Length
}

export interface PcbNoteLine {
  type: "pcb_note_line"
  pcb_note_line_id: string
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
  name?: string
  text?: string
  x1: Distance
  y1: Distance
  x2: Distance
  y2: Distance
  stroke_width: Distance
  color?: string
  is_dashed?: boolean
}

export interface PcbNotePath {
  type: "pcb_note_path"
  pcb_note_path_id: string
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
  name?: string
  text?: string
  route: Point[]
  stroke_width: Length
  color?: string
}

export interface PcbNoteRect {
  type: "pcb_note_rect"
  pcb_note_rect_id: string
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
  name?: string
  text?: string
  center: Point
  width: Length
  height: Length
  stroke_width: Length
  is_filled?: boolean
  has_stroke?: boolean
  is_stroke_dashed?: boolean
  color?: string
}

export interface PcbNoteText {
  type: "pcb_note_text"
  pcb_note_text_id: string
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
  name?: string
  font: "tscircuit2024"
  font_size: Length
  text?: string
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

export interface PcbCourtyardRect {
  type: "pcb_courtyard_rect"
  pcb_courtyard_rect_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  center: Point
  width: Length
  height: Length
  layer: VisibleLayer
  color?: string
}

export interface PcbCourtyardOutline {
  type: "pcb_courtyard_outline"
  pcb_courtyard_outline_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  layer: VisibleLayer
  outline: Point[]
  stroke_width: Length
  is_closed?: boolean
  is_stroke_dashed?: boolean
  color?: string
}

export interface PcbCourtyardPolygon {
  type: "pcb_courtyard_polygon"
  pcb_courtyard_polygon_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  layer: VisibleLayer
  points: Point[]
  color?: string
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
  error_type: "pcb_placement_error"
  message: string
}

export interface PcbPort {
  type: "pcb_port"
  pcb_port_id: string
  source_port_id: string
  pcb_component_id?: string
  x: Distance
  y: Distance
  layers: LayerRef[]
  is_board_pinout?: boolean
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
  is_covered_with_solder_mask?: boolean
}

export interface PcbSmtPadRect {
  type: "pcb_smtpad"
  shape: "rect"
  pcb_smtpad_id: string
  x: Distance
  y: Distance
  width: number
  height: number
  rect_border_radius?: number
  layer: LayerRef
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  is_covered_with_solder_mask?: boolean
}


export interface PcbSmtPadPolygon {
  type: "pcb_smtpad"
  shape: "polygon"
  pcb_smtpad_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  points: Point[]
  layer: LayerRef
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  is_covered_with_solder_mask?: boolean
}


export type PcbSmtPad =
  | PcbSmtPadCircle
  | PcbSmtPadRect
  | PcbSmtPadPolygon

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
  pcb_group_id?: string
  subcircuit_id?: string
  pcb_trace_id: string
  route_order_index?: number
  route_thickness_mode?: "constant" | "interpolated"
  should_round_corners?: boolean
  trace_length?: number
  highlight_color?: string
  route: Array<PcbTraceRoutePoint>
}

export interface PcbNet {
  type: "pcb_net"
  pcb_net_id: string
  source_net_id?: string
  highlight_color?: string
}

export interface PcbBreakoutPoint {
  type: "pcb_breakout_point"
  pcb_breakout_point_id: string
  pcb_group_id: string
  subcircuit_id?: string
  source_trace_id?: string
  source_port_id?: string
  source_net_id?: string
  x: Distance
  y: Distance
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