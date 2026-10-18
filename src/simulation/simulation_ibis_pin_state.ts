import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"

export const simulation_ibis_pin_state = z
  .object({
    type: z.literal("simulation_ibis_pin_state"),
    simulation_ibis_pin_state_id: getZodPrefixedIdWithDefault(
      "simulation_ibis_pin_state",
    ),
    simulation_experiment_id: z.string().min(1),
    source_port_id: z.string().min(1),
    is_output: z
      .boolean()
      .describe(
        "True selects output mode; false selects input mode for this experiment",
      ),
    is_output_enabled: z.boolean().optional(),
  })
  .superRefine((pin, context) => {
    if (
      (pin.is_output && pin.is_output_enabled === undefined) ||
      (!pin.is_output && pin.is_output_enabled !== undefined)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["is_output_enabled"],
        message:
          "Only output pins require an explicit is_output_enabled boolean",
      })
    }
  })
  .describe(
    "Declares an IBIS pin's direction and output-enable state for one experiment",
  )

export type SimulationIbisPinState = z.infer<typeof simulation_ibis_pin_state>
export type SimulationIbisPinStateInput = z.input<
  typeof simulation_ibis_pin_state
>
