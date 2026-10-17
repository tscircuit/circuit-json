import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"

const sha256 = z.string().regex(/^[a-f0-9]{64}$/i)
const archive = z
  .object({
    member: z.string().min(1),
    member_sha256: sha256.optional(),
  })
  .strict()

/** The source is declared here; parsing never downloads or converts a model. */
export const simulation_ibis_source = z.union([
  z
    .object({ url: z.string().url(), sha256, archive: archive.optional() })
    .strict(),
  z
    .object({
      file: z.string().min(1),
      sha256: sha256.optional(),
      archive: archive.optional(),
    })
    .strict(),
  z.object({ content: z.string().min(1), sha256: sha256.optional() }).strict(),
])
export type SimulationIbisSource = z.infer<typeof simulation_ibis_source>

/** Vendor pin numbers map to physical source ports; reference roles also use source port IDs. */
export const simulation_ibis_model = z
  .object({
    type: z.literal("simulation_ibis_model"),
    simulation_ibis_model_id: getZodPrefixedIdWithDefault(
      "simulation_ibis_model",
    ),
    source_component_id: z.string().min(1),
    source: simulation_ibis_source,
    component: z.string().min(1),
    pin_to_source_port_map: z
      .record(z.string().min(1), z.string().min(1))
      .refine(
        (pins) => Object.keys(pins).length > 0,
        "At least one physical IBIS pin is required",
      ),
    model_selections: z.record(z.string().min(1), z.string().min(1)).optional(),
    references: z
      .record(
        z.string().min(1),
        z
          .object({
            pullup: z.string().min(1).optional(),
            pulldown: z.string().min(1).optional(),
            power_clamp: z.string().min(1).optional(),
            ground_clamp: z.string().min(1).optional(),
            external: z.string().min(1).optional(),
          })
          .strict(),
      )
      .optional(),
    corner: z.enum(["typical", "minimum", "maximum"]),
    package_policy: z.enum(["vendor", "omit"]),
  })
  .describe(
    "Declares a vendor IBIS model and its physical pin and reference mappings",
  )

export type SimulationIbisModel = z.infer<typeof simulation_ibis_model>
export type SimulationIbisModelInput = z.input<typeof simulation_ibis_model>
