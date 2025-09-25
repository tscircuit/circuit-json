import { type Point, getZodPrefixedIdWithDefault, point } from "src/common"
import { type Length, type Rotation, length, rotation } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"
import { type BRepShape, brep_shape } from "./properties/brep"
import { type LayerRef, layer_ref } from "./properties/layer_ref"

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

// BRep Pour
export const pcb_copper_pour_brep = pcb_copper_pour_base.extend({
  shape: z.literal("brep"),
  brep_shape: brep_shape,
})
export type PcbCopperPourBRepInput = z.input<typeof pcb_copper_pour_brep>
type InferredPcbCopperPourBRep = z.infer<typeof pcb_copper_pour_brep>
/**
 * Defines a BRep copper pour on the PCB.
 */
export interface PcbCopperPourBRep {
  type: "pcb_copper_pour"
  pcb_copper_pour_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  layer: LayerRef
  source_net_id?: string
  shape: "brep"
  brep_shape: BRepShape
}
expectTypesMatch<PcbCopperPourBRep, InferredPcbCopperPourBRep>(true)

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
    pcb_copper_pour_brep,
    pcb_copper_pour_polygon,
  ])
  .describe("Defines a copper pour on the PCB.")

export type PcbCopperPourInput = z.input<typeof pcb_copper_pour>
export type PcbCopperPour =
  | PcbCopperPourRect
  | PcbCopperPourBRep
  | PcbCopperPourPolygon

type InferredPcbCopperPour = z.infer<typeof pcb_copper_pour>
expectTypesMatch<PcbCopperPour, InferredPcbCopperPour>(true)
