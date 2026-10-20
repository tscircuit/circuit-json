import { z } from "zod"
import { asset, getZodPrefixedIdWithDefault } from "src/common"

export const simulation_ibis_model = z
  .object({
    type: z.literal("simulation_ibis_model"),
    simulation_ibis_model_id: getZodPrefixedIdWithDefault(
      "simulation_ibis_model",
    ),
    source_component_id: z.string().min(1),
    ibis_model_asset: asset.describe(
      "Reference to the .ibs file containing the vendor's IBIS models",
    ),
    ibis_component_name: z
      .string()
      .min(1)
      .describe("Name of the [Component] section in the IBIS file"),
    ibis_pin_name_to_source_port_id: z
      .record(z.string().min(1), z.string().min(1))
      .refine(
        (pins) => Object.keys(pins).length > 0,
        "At least one physical IBIS pin is required",
      )
      .describe(
        "Maps pin names from the IBIS [Pin] table, such as A1 or 12, to physical source_port_id values",
      ),
    ibis_pin_name_to_model_name: z
      .record(z.string().min(1), z.string().min(1))
      .optional()
      .describe(
        "Maps an IBIS pin name to the selected [Model] name when its [Model Selector] has multiple buffers",
      ),
    ibis_pin_name_to_reference_source_port_ids: z
      .record(
        z.string().min(1),
        z
          .object({
            pullup_reference_source_port_id: z.string().min(1).optional(),
            pulldown_reference_source_port_id: z.string().min(1).optional(),
            power_clamp_reference_source_port_id: z.string().min(1).optional(),
            ground_clamp_reference_source_port_id: z.string().min(1).optional(),
            external_reference_source_port_id: z.string().min(1).optional(),
          })
          .strict(),
      )
      .optional()
      .describe(
        "Maps each IBIS signal pin name to the physical source ports used as its buffer supply/clamp references",
      ),
    model_value_corner: z
      .union([z.literal("typical"), z.literal("minimum"), z.literal("maximum")])
      .describe(
        "Selects the typ, min, or max column of numerical data in the IBIS model",
      ),
    include_package_parasitics: z
      .boolean()
      .describe(
        "Whether the runner includes the IBIS vendor's package resistance, inductance, and capacitance",
      ),
  })
  .superRefine((model, context) => {
    const boundPins = new Set(
      Object.keys(model.ibis_pin_name_to_source_port_id),
    )
    for (const field of [
      "ibis_pin_name_to_model_name",
      "ibis_pin_name_to_reference_source_port_ids",
    ] as const) {
      for (const pin of Object.keys(model[field] ?? {})) {
        if (!boundPins.has(pin)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field, pin],
            message: `IBIS pin "${pin}" must be bound in ibis_pin_name_to_source_port_id`,
          })
        }
      }
    }
  })
  .describe(
    "Attaches an IBIS component and its physical pin bindings to a source component",
  )

export type SimulationIbisModel = z.infer<typeof simulation_ibis_model>
export type SimulationIbisModelInput = z.input<typeof simulation_ibis_model>
