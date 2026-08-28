import { z } from "zod"
import { getZodPrefixedIdWithDefault, point, type Point } from "src/common"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { distance, type Distance, rotation, type Rotation } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

const pcb_soldermask_opening_circle = z.object({
  type: z.literal("pcb_soldermask_opening"),
  shape: z.literal("circle"),
  pcb_soldermask_opening_id: getZodPrefixedIdWithDefault(
    "pcb_soldermask_opening",
  ),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  x: distance,
  y: distance,
  radius: distance,
  layer: layer_ref,
  pcb_component_id: z.string().optional(),
})

const pcb_soldermask_opening_rect = z.object({
  type: z.literal("pcb_soldermask_opening"),
  shape: z.literal("rect"),
  pcb_soldermask_opening_id: getZodPrefixedIdWithDefault(
    "pcb_soldermask_opening",
  ),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  x: distance,
  y: distance,
  width: distance,
  height: distance,
  layer: layer_ref,
  pcb_component_id: z.string().optional(),
})

const pcb_soldermask_opening_rotated_rect = z.object({
  type: z.literal("pcb_soldermask_opening"),
  shape: z.literal("rotated_rect"),
  pcb_soldermask_opening_id: getZodPrefixedIdWithDefault(
    "pcb_soldermask_opening",
  ),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  x: distance,
  y: distance,
  width: distance,
  height: distance,
  ccw_rotation: rotation,
  layer: layer_ref,
  pcb_component_id: z.string().optional(),
})

const pcb_soldermask_opening_polygon = z.object({
  type: z.literal("pcb_soldermask_opening"),
  shape: z.literal("polygon"),
  pcb_soldermask_opening_id: getZodPrefixedIdWithDefault(
    "pcb_soldermask_opening",
  ),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  points: z.array(point).min(3),
  layer: layer_ref,
  pcb_component_id: z.string().optional(),
})

export const pcb_soldermask_opening = z
  .discriminatedUnion("shape", [
    pcb_soldermask_opening_circle,
    pcb_soldermask_opening_rect,
    pcb_soldermask_opening_rotated_rect,
    pcb_soldermask_opening_polygon,
  ])
  .describe("Defines an explicit opening in the PCB solder mask")

export type PcbSoldermaskOpeningInput = z.input<typeof pcb_soldermask_opening>

type InferredPcbSoldermaskOpening = z.infer<typeof pcb_soldermask_opening>

/** Defines a circular opening in the PCB solder mask. */
export interface PcbSoldermaskOpeningCircle {
  type: "pcb_soldermask_opening"
  pcb_soldermask_opening_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  shape: "circle"
  x: Distance
  y: Distance
  radius: Distance
  layer: LayerRef
  pcb_component_id?: string
}

/** Defines a rectangular opening in the PCB solder mask. */
export interface PcbSoldermaskOpeningRect {
  type: "pcb_soldermask_opening"
  pcb_soldermask_opening_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  shape: "rect"
  x: Distance
  y: Distance
  width: Distance
  height: Distance
  layer: LayerRef
  pcb_component_id?: string
}

/** Defines a rotated rectangular opening in the PCB solder mask. */
export interface PcbSoldermaskOpeningRotatedRect {
  type: "pcb_soldermask_opening"
  pcb_soldermask_opening_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  shape: "rotated_rect"
  x: Distance
  y: Distance
  width: Distance
  height: Distance
  ccw_rotation: Rotation
  layer: LayerRef
  pcb_component_id?: string
}

/** Defines a polygonal opening in the PCB solder mask. */
export interface PcbSoldermaskOpeningPolygon {
  type: "pcb_soldermask_opening"
  pcb_soldermask_opening_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  shape: "polygon"
  points: Point[]
  layer: LayerRef
  pcb_component_id?: string
}

export type PcbSoldermaskOpening =
  | PcbSoldermaskOpeningCircle
  | PcbSoldermaskOpeningRect
  | PcbSoldermaskOpeningRotatedRect
  | PcbSoldermaskOpeningPolygon

expectTypesMatch<PcbSoldermaskOpening, InferredPcbSoldermaskOpening>(true)
