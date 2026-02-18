import { z } from "zod"
import { distance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  kicadAt,
  kicadFont,
  type KicadAt,
  type KicadFont,
} from "./kicadFootprintMetadata"

export interface KicadSymbolPinNumbers {
  hide?: boolean
}

export const kicadSymbolPinNumbers = z.object({
  hide: z.boolean().optional(),
})

type InferredKicadSymbolPinNumbers = z.infer<typeof kicadSymbolPinNumbers>
expectTypesMatch<KicadSymbolPinNumbers, InferredKicadSymbolPinNumbers>(true)

export interface KicadSymbolPinNames {
  offset?: number
  hide?: boolean
}

export const kicadSymbolPinNames = z.object({
  offset: distance.optional(),
  hide: z.boolean().optional(),
})

type InferredKicadSymbolPinNames = z.infer<typeof kicadSymbolPinNames>
expectTypesMatch<KicadSymbolPinNames, InferredKicadSymbolPinNames>(true)

export interface KicadSymbolEffects {
  font?: KicadFont
  justify?: string | string[]
  hide?: boolean
}

export const kicadSymbolEffects = z.object({
  font: kicadFont.optional(),
  justify: z.union([z.string(), z.array(z.string())]).optional(),
  hide: z.boolean().optional(),
})

type InferredKicadSymbolEffects = z.infer<typeof kicadSymbolEffects>
expectTypesMatch<KicadSymbolEffects, InferredKicadSymbolEffects>(true)

export interface KicadSymbolProperty {
  value: string
  id?: number | string
  at?: KicadAt
  effects?: KicadSymbolEffects
}

export const kicadSymbolProperty = z.object({
  value: z.string(),
  id: z.union([z.number(), z.string()]).optional(),
  at: kicadAt.optional(),
  effects: kicadSymbolEffects.optional(),
})

type InferredKicadSymbolProperty = z.infer<typeof kicadSymbolProperty>
expectTypesMatch<KicadSymbolProperty, InferredKicadSymbolProperty>(true)

export interface KicadSymbolProperties {
  Reference?: KicadSymbolProperty
  Value?: KicadSymbolProperty
  Footprint?: KicadSymbolProperty
  Datasheet?: KicadSymbolProperty
  Description?: KicadSymbolProperty
  ki_keywords?: KicadSymbolProperty
  ki_fp_filters?: KicadSymbolProperty
}

export const kicadSymbolProperties = z.object({
  Reference: kicadSymbolProperty.optional(),
  Value: kicadSymbolProperty.optional(),
  Footprint: kicadSymbolProperty.optional(),
  Datasheet: kicadSymbolProperty.optional(),
  Description: kicadSymbolProperty.optional(),
  ki_keywords: kicadSymbolProperty.optional(),
  ki_fp_filters: kicadSymbolProperty.optional(),
})

type InferredKicadSymbolProperties = z.infer<typeof kicadSymbolProperties>
expectTypesMatch<KicadSymbolProperties, InferredKicadSymbolProperties>(true)

export interface KicadSymbolMetadata {
  symbolName?: string
  extends?: string
  pinNumbers?: KicadSymbolPinNumbers
  pinNames?: KicadSymbolPinNames
  excludeFromSim?: boolean
  inBom?: boolean
  onBoard?: boolean
  properties?: KicadSymbolProperties
  embeddedFonts?: boolean
}

export const kicadSymbolMetadata = z.object({
  symbolName: z.string().optional(),
  extends: z.string().optional(),
  pinNumbers: kicadSymbolPinNumbers.optional(),
  pinNames: kicadSymbolPinNames.optional(),
  excludeFromSim: z.boolean().optional(),
  inBom: z.boolean().optional(),
  onBoard: z.boolean().optional(),
  properties: kicadSymbolProperties.optional(),
  embeddedFonts: z.boolean().optional(),
})

type InferredKicadSymbolMetadata = z.infer<typeof kicadSymbolMetadata>
expectTypesMatch<KicadSymbolMetadata, InferredKicadSymbolMetadata>(true)
