import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { length, type Length, rotation, type Rotation } from "src/units"
import { layer_ref, type LayerRef } from "./properties/layer_ref"
import { expectTypesMatch } from "src/utils/expect-types-match"

// Common properties base for all pour shapes (internal)
const pcb_copper_pour_base = z.object({
  type: z.literal("pcb_copper_pour"),
  pcb_copper_pour_id: getZodPrefixedIdWithDefault("pcb_copper_pour"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  layer: layer_ref,
  source_net_id: z.string().optional(),
})

// Rectangular Pour
export const pcb_copper_pour_rect = pcb_copper_pour_base.extend({
  shape: z.literal("rect"),
  center: point,
  width: length,
  height: length,
  rotation: rotation.optional(),
})
export type PcbCopperPourRectInput = z.input<typeof pcb_copper_pour_rect>
type InferredPcbCopperPourRect = z.infer<typeof pcb_copper_pour_rect>
/**
 * Defines a rectangular copper pour on the PCB.
 */
export interface PcbCopperPourRect {
  type: "pcb_copper_pour"
  pcb_copper_pour_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  layer: LayerRef
  source_net_id?: string
  shape: "rect"
  center: Point
  width: Length
  height: Length
  rotation?: Rotation
}
expectTypesMatch<PcbCopperPourRect, InferredPcbCopperPourRect>(true)

// Circular Pour
export const pcb_copper_pour_circle = pcb_copper_pour_base.extend({
  shape: z.literal("circle"),
  center: point,
  radius: length,
})
export type PcbCopperPourCircleInput = z.input<typeof pcb_copper_pour_circle>
type InferredPcbCopperPourCircle = z.infer<typeof pcb_copper_pour_circle>
/**
 * Defines a circular copper pour on the PCB.
 */
export interface PcbCopperPourCircle {
  type: "pcb_copper_pour"
  pcb_copper_pour_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  layer: LayerRef
  source_net_id?: string
  shape: "circle"
  center: Point
  radius: Length
}
expectTypesMatch<PcbCopperPourCircle, InferredPcbCopperPourCircle>(true)

// Polygon Pour
export const pcb_copper_pour_polygon = pcb_copper_pour_base.extend({
  shape: z.literal("polygon"),
  points: z.array(point),
})
export type PcbCopperPourPolygonInput = z.input<typeof pcb_copper_pour_polygon>
type InferredPcbCopperPourPolygon = z.infer<typeof pcb_copper_pour_polygon>
/**
 * Defines a polygonal copper pour on the PCB, specified by a list of points.
 * The polygon should be closed (the last point implicitly connects to the first).
 */
export interface PcbCopperPourPolygon {
  type: "pcb_copper_pour"
  pcb_copper_pour_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  layer: LayerRef
  source_net_id?: string
  shape: "polygon"
  points: Point[]
}
expectTypesMatch<PcbCopperPourPolygon, InferredPcbCopperPourPolygon>(true)

// Union of all pour shapes
export const pcb_copper_pour = z
  .discriminatedUnion("shape", [
    pcb_copper_pour_rect,
    pcb_copper_pour_circle,
    pcb_copper_pour_polygon,
  ])
  .describe("Defines a copper pour on the PCB.")

export type PcbCopperPourInput = z.input<typeof pcb_copper_pour>
export type PcbCopperPour =
  | PcbCopperPourRect
  | PcbCopperPourCircle
  | PcbCopperPourPolygon

type InferredPcbCopperPour = z.infer<typeof pcb_copper_pour>
expectTypesMatch<PcbCopperPour, InferredPcbCopperPour>(true)
