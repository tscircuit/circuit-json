import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "./base/source_component_base"

export const source_simple_fuse = source_component_base.extend({
  ftype: z.literal("simple_fuse"),
  currentRating: z.union([z.number(), z.string()]),
  voltageRating: z.union([z.number(), z.string()]).optional(),
  schShowRatings: z.boolean().optional(),
})

export interface SourceSimpleFuse extends SourceComponentBase {
  ftype: "simple_fuse"
  /**
   * Current rating of the fuse
   */
  currentRating: number | string

  /**
   * Voltage rating of the fuse
   */
  voltageRating?: number | string

  /**
   * Whether to show ratings on schematic
   */
  schShowRatings?: boolean
}

export type SourceSimpleFuseInput = z.input<typeof source_simple_fuse>
