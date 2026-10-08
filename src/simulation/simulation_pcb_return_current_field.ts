import { z } from "zod"
import { getZodPrefixedIdWithDefault, type Asset } from "../common"
import { layer_ref, type LayerRef } from "../pcb/properties/layer_ref"
import { expectTypesMatch } from "../utils/expect-types-match"
import { return_current_field_asset } from "./return_current_asset"

export const simulation_pcb_return_current_field = z
  .object({
    type: z.literal("simulation_pcb_return_current_field"),
    simulation_pcb_return_current_field_id: getZodPrefixedIdWithDefault(
      "simulation_pcb_return_current_field",
    ),
    simulation_pcb_return_current_result_id: z.string().min(1),
    layer: layer_ref,
    source_net_id: z.string().min(1),
    field_type: z.enum(["real", "complex_phasor"]),
    min_x: z.number().finite(),
    min_y: z.number().finite(),
    columns: z.number().int().positive().safe(),
    rows: z.number().int().positive().safe(),
    cell_width: z.number().finite().positive(),
    cell_height: z.number().finite().positive(),
    copper_thickness: z.number().finite().positive(),
    data_format: z.literal("return_current_grid_json_v1"),
    field_asset: return_current_field_asset,
  })
  .superRefine((field, context) => {
    if (!Number.isSafeInteger(field.columns * field.rows)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["columns"],
        message: "The grid cell count must be a safe integer",
      })
    }
  })
  .describe(
    "A sampled sheet-current field in A/mm, using plain or gzipped JSON Asset URLs; dimensions are PCB millimeters",
  )

export interface SimulationPcbReturnCurrentField {
  type: "simulation_pcb_return_current_field"
  simulation_pcb_return_current_field_id: string
  simulation_pcb_return_current_result_id: string
  layer: LayerRef
  source_net_id: string
  field_type: "real" | "complex_phasor"
  min_x: number
  min_y: number
  columns: number
  rows: number
  cell_width: number
  cell_height: number
  copper_thickness: number
  data_format: "return_current_grid_json_v1"
  field_asset: Asset
}

export type SimulationPcbReturnCurrentFieldInput = z.input<
  typeof simulation_pcb_return_current_field
>
expectTypesMatch<
  SimulationPcbReturnCurrentField,
  z.infer<typeof simulation_pcb_return_current_field>
>(true)
