import { z } from "zod"
import { expectTypesMatch } from "../utils/expect-types-match"
import type { SimulationPcbReturnCurrentField } from "./simulation_pcb_return_current_field"

const channel = z.array(z.number().finite().nullable()).min(1)

/**
 * Decoded return_current_grid_json_v1. Channels are row-major from bottom-left,
 * in A/mm. Complex channels are peak phasors using exp(+jωt).
 * This validates decoded JSON; it does not fetch assets or decompress gzip.
 */
export const return_current_grid_json = z
  .discriminatedUnion("field_type", [
    z.object({
      field_type: z.literal("real"),
      sheet_current_x: channel,
      sheet_current_y: channel,
    }),
    z.object({
      field_type: z.literal("complex_phasor"),
      sheet_current_x_real: channel,
      sheet_current_x_imag: channel,
      sheet_current_y_real: channel,
      sheet_current_y_imag: channel,
    }),
  ])
  .superRefine((grid, context) => {
    const channels =
      grid.field_type === "real"
        ? [grid.sheet_current_x, grid.sheet_current_y]
        : [
            grid.sheet_current_x_real,
            grid.sheet_current_x_imag,
            grid.sheet_current_y_real,
            grid.sheet_current_y_imag,
          ]
    const first = channels[0]!
    if (channels.some((values) => values.length !== first.length)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Current channels must have equal lengths",
      })
      return
    }
    for (let index = 0; index < first.length; index++) {
      const masked = first[index] === null
      if (channels.some((values) => (values[index] === null) !== masked)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Cell ${index} must be null in every channel or finite in every channel`,
        })
        return
      }
    }
  })
  .describe(
    "Decoded real or complex sheet-current arrays with a shared conductor mask",
  )

export type ReturnCurrentGridJson =
  | {
      field_type: "real"
      sheet_current_x: (number | null)[]
      sheet_current_y: (number | null)[]
    }
  | {
      field_type: "complex_phasor"
      sheet_current_x_real: (number | null)[]
      sheet_current_x_imag: (number | null)[]
      sheet_current_y_real: (number | null)[]
      sheet_current_y_imag: (number | null)[]
    }

export type ReturnCurrentGridJsonInput = z.input<
  typeof return_current_grid_json
>
expectTypesMatch<
  ReturnCurrentGridJson,
  z.infer<typeof return_current_grid_json>
>(true)

/** Validate decoded channels against their parent field's dimensions and kind. */
export function getReturnCurrentGridJsonSchema(
  field: Pick<
    SimulationPcbReturnCurrentField,
    "columns" | "rows" | "field_type"
  >,
) {
  const count = field.columns * field.rows
  if (
    !Number.isSafeInteger(field.columns) ||
    field.columns <= 0 ||
    !Number.isSafeInteger(field.rows) ||
    field.rows <= 0 ||
    !Number.isSafeInteger(count)
  )
    throw new Error("Grid dimensions must be positive safe integers")
  return return_current_grid_json.superRefine((grid, context) => {
    if (grid.field_type !== field.field_type) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["field_type"],
        message: "Decoded field_type must match the parent field",
      })
    }
    const first =
      grid.field_type === "real"
        ? grid.sheet_current_x
        : grid.sheet_current_x_real
    if (first.length !== count) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Each current channel must have ${count} entries (columns * rows)`,
      })
    }
  })
}
