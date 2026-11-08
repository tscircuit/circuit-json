import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** Per received strobe edge and worst setup/hold margins in seconds; negative margins fail. */
export interface SimulationSignalStrobeMargin {
  type: "simulation_signal_strobe_margin"
  simulation_signal_strobe_margin_id: string
  simulation_signal_id: string
  source_port_id: string
  edges: { time_s: number; setup_margin_s: number; hold_margin_s: number }[]
  worst_setup_margin_s: number
  worst_hold_margin_s: number
}

export const simulation_signal_strobe_margin = z
  .object({
    type: z.literal("simulation_signal_strobe_margin"),
    simulation_signal_strobe_margin_id: getZodPrefixedIdWithDefault(
      "simulation_signal_strobe_margin",
    ),
    simulation_signal_id: z.string().min(1),
    source_port_id: z.string().min(1),
    edges: z
      .array(
        z.object({
          time_s: z.number().finite().nonnegative(),
          setup_margin_s: z.number().finite(),
          hold_margin_s: z.number().finite(),
        }),
      )
      .min(1),
    worst_setup_margin_s: z.number().finite(),
    worst_hold_margin_s: z.number().finite(),
  })
  .refine(
    (result) =>
      result.edges.every(
        (edge, index, edges) =>
          index === 0 || edge.time_s > edges[index - 1]!.time_s,
      ),
    { path: ["edges"], message: "Strobe edges must be in time order" },
  )
  .superRefine((result, context) => {
    for (const field of ["setup_margin_s", "hold_margin_s"] as const) {
      const worst = result[`worst_${field}`]
      if (
        !result.edges.some((edge) => edge[field] === worst) ||
        result.edges.some((edge) => edge[field] < worst)
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: [`worst_${field}`],
          message: "Worst margin must equal the minimum per-edge margin",
        })
      }
    }
  })
  .describe(
    "Stores per-edge and worst receiver setup and hold margins in seconds",
  )

export type SimulationSignalStrobeMarginInput = z.input<
  typeof simulation_signal_strobe_margin
>
expectTypesMatch<
  SimulationSignalStrobeMargin,
  z.infer<typeof simulation_signal_strobe_margin>
>(true)
