import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { ms } from "src/units"

export const simulation_eye_diagram = z
  .object({
    type: z.literal("simulation_eye_diagram"),
    simulation_eye_diagram_id: getZodPrefixedIdWithDefault(
      "simulation_eye_diagram",
    ),
    name: z.string().min(1),
    simulation_experiment_id: z.string().min(1),
    simulation_voltage_probe_id: z.string().min(1),
    unit_interval_ms: ms.refine((milliseconds) => milliseconds > 0),
    time_origin_ms: ms,
    start_time_ms: ms.refine((milliseconds) => milliseconds >= 0).optional(),
    end_time_ms: ms.refine((milliseconds) => milliseconds > 0).optional(),
  })
  .superRefine((eye, context) => {
    if (
      eye.start_time_ms !== undefined &&
      eye.end_time_ms !== undefined &&
      eye.start_time_ms >= eye.end_time_ms
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end_time_ms"],
        message: "Eye gate end must follow its start",
      })
    }
  })
  .describe(
    "Declares probe-bound eye folding, fixed origin and optional measurement gate in milliseconds",
  )

export type SimulationEyeDiagram = z.infer<typeof simulation_eye_diagram>
export type SimulationEyeDiagramInput = z.input<typeof simulation_eye_diagram>
