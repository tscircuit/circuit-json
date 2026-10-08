import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "../common"
import { layer_ref, type LayerRef } from "../pcb/properties/layer_ref"
import { expectTypesMatch } from "../utils/expect-types-match"

const marker_base = z.object({
  type: z.literal("simulation_pcb_return_current_marker"),
  simulation_pcb_return_current_marker_id: getZodPrefixedIdWithDefault(
    "simulation_pcb_return_current_marker",
  ),
  simulation_pcb_return_current_result_id: z.string().min(1),
  role: z.enum([
    "signal_source",
    "signal_load",
    "return_source",
    "return_sink",
    "signal_transition",
    "return_transition",
  ]),
  label: z.string().optional(),
  label_x: z.number().finite().optional(),
  label_y: z.number().finite().optional(),
})

export const simulation_pcb_return_current_marker = z
  .discriminatedUnion("target_type", [
    marker_base.extend({
      target_type: z.literal("pcb_port"),
      pcb_port_id: z.string().min(1),
      layer: layer_ref,
    }),
    marker_base.extend({
      target_type: z.literal("pcb_via"),
      pcb_via_id: z.string().min(1),
      from_layer: layer_ref,
      to_layer: layer_ref,
    }),
  ])
  .superRefine((marker, context) => {
    if ((marker.label_x === undefined) !== (marker.label_y === undefined)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["label_x"],
        message: "label_x and label_y must be provided together",
      })
    }
    if (
      marker.target_type === "pcb_via" &&
      marker.from_layer === marker.to_layer
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["to_layer"],
        message: "A via transition must connect distinct layers",
      })
    }
  })
  .describe(
    "A signal/return port or via highlight; markers do not assert measured via-transfer currents",
  )

export interface ReturnCurrentMarkerBase {
  type: "simulation_pcb_return_current_marker"
  simulation_pcb_return_current_marker_id: string
  simulation_pcb_return_current_result_id: string
  role:
    | "signal_source"
    | "signal_load"
    | "return_source"
    | "return_sink"
    | "signal_transition"
    | "return_transition"
  label?: string
  label_x?: number
  label_y?: number
}

export interface SimulationPcbReturnCurrentPortMarker
  extends ReturnCurrentMarkerBase {
  target_type: "pcb_port"
  pcb_port_id: string
  layer: LayerRef
}

export interface SimulationPcbReturnCurrentViaMarker
  extends ReturnCurrentMarkerBase {
  target_type: "pcb_via"
  pcb_via_id: string
  from_layer: LayerRef
  to_layer: LayerRef
}

export type SimulationPcbReturnCurrentMarker =
  | SimulationPcbReturnCurrentPortMarker
  | SimulationPcbReturnCurrentViaMarker

export type SimulationPcbReturnCurrentMarkerInput = z.input<
  typeof simulation_pcb_return_current_marker
>
expectTypesMatch<
  SimulationPcbReturnCurrentMarker,
  z.infer<typeof simulation_pcb_return_current_marker>
>(true)
