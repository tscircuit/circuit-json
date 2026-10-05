import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { type LayerRef, layer_string } from "./layer_ref"

const copper_layer = z.object({
  type: z.literal("copper"),
  layer: layer_string,
  thickness_mm: z.number().finite().positive().optional(),
})

const dielectric_layer = z.object({
  type: z.literal("dielectric"),
  dielectric_type: z.enum(["core", "prepreg"]).optional(),
  material: z.string().trim().min(1).optional(),
  thickness_mm: z.number().finite().positive().optional(),
  dielectric_constant: z.number().finite().positive().optional(),
  dielectric_constant_frequency_hz: z.number().finite().positive().optional(),
})

export const pcb_stackup = z
  .object({
    source: z.enum(["specified", "assumed"]),
    manufacturer: z.string().trim().min(1).optional(),
    manufacturer_stackup_id: z.string().trim().min(1).optional(),
    source_url: z.string().url().optional(),
    layers: z.array(
      z.discriminatedUnion("type", [copper_layer, dielectric_layer]),
    ),
  })
  .superRefine((stackup, ctx) => {
    if (stackup.manufacturer_stackup_id && !stackup.manufacturer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["manufacturer"],
        message: "manufacturer is required with manufacturer_stackup_id",
      })
    }

    const copper_count = stackup.layers.filter(
      (layer) => layer.type === "copper",
    ).length
    if (copper_count === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["layers"],
        message: "Stackup must contain at least one copper layer",
      })
      return
    }

    let copper_position = 0
    for (const [layer_index, layer] of stackup.layers.entries()) {
      if (layer.type === "dielectric") {
        if (layer_index === 0 || layer_index === stackup.layers.length - 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["layers", layer_index, "type"],
            message: "Dielectric layers must be between copper layers",
          })
        }
        if (
          layer.dielectric_constant_frequency_hz !== undefined &&
          layer.dielectric_constant === undefined
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["layers", layer_index, "dielectric_constant"],
            message:
              "dielectric_constant is required when its frequency is supplied",
          })
        }
        continue
      }

      const expected_layer =
        copper_position === 0
          ? "top"
          : copper_position === copper_count - 1
            ? "bottom"
            : `inner${copper_position}`
      if (layer.layer !== expected_layer) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["layers", layer_index, "layer"],
          message: `Expected copper layer ${expected_layer} at copper position ${copper_position + 1} (top to bottom)`,
        })
      }
      if (stackup.layers[layer_index - 1]?.type === "copper") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["layers", layer_index, "type"],
          message:
            "Adjacent copper layers must be separated by a dielectric layer",
        })
      }
      copper_position++
    }
  })
  .describe("Physical copper and dielectric layers in top-to-bottom order")

/**
 * Physical copper/laminate sequence belonging to one pcb_board, without electrical roles.
 * Missing quantities are unknown. No material, thickness, or Er defaults are applied.
 */
export interface PcbStackup {
  /** Supplied declarations are specified; any guessed field/order makes the whole model assumed. Neither means verified. */
  source: "specified" | "assumed"
  manufacturer?: string
  manufacturer_stackup_id?: string
  source_url?: string
  layers: PcbStackupLayer[]
}

/** Copper thickness is the nominal finished conductor thickness in millimeters. */
export interface PcbStackupCopperLayer {
  type: "copper"
  layer: LayerRef
  thickness_mm?: number
}

/** Dielectric thickness excludes copper and is the nominal thickness after pressing. */
export interface PcbStackupDielectricLayer {
  type: "dielectric"
  dielectric_type?: "core" | "prepreg"
  /** Material product or construction label; it does not imply an Er. */
  material?: string
  thickness_mm?: number
  /** Dimensionless relative permittivity (Er), not an effective trace permittivity. */
  dielectric_constant?: number
  /** Frequency of the supplied Er in hertz. Omission means frequency is unknown. */
  dielectric_constant_frequency_hz?: number
}

export type PcbStackupLayer = PcbStackupCopperLayer | PcbStackupDielectricLayer

export type PcbStackupInput = z.input<typeof pcb_stackup>

expectTypesMatch<PcbStackup, z.output<typeof pcb_stackup>>(true)
