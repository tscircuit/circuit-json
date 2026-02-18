import { z } from "zod"
import { point } from "./point"
import { point3 } from "./point3"
import { distance, rotation } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export interface KicadAt {
  x: number
  y: number
  rotation?: number
}

export const kicadAt = point.extend({
  rotation: rotation.optional(),
})

type InferredKicadAt = z.infer<typeof kicadAt>
expectTypesMatch<KicadAt, InferredKicadAt>(true)

export interface KicadFont {
  size?: { x: number; y: number }
  thickness?: number
}

export const kicadFont = z.object({
  size: point.optional(),
  thickness: distance.optional(),
})

type InferredKicadFont = z.infer<typeof kicadFont>
expectTypesMatch<KicadFont, InferredKicadFont>(true)

export interface KicadEffects {
  font?: KicadFont
}

export const kicadEffects = z.object({
  font: kicadFont.optional(),
})

type InferredKicadEffects = z.infer<typeof kicadEffects>
expectTypesMatch<KicadEffects, InferredKicadEffects>(true)

export interface KicadProperty {
  value: string
  at?: KicadAt
  layer?: string
  uuid?: string
  hide?: boolean
  effects?: KicadEffects
}

export const kicadProperty = z.object({
  value: z.string(),
  at: kicadAt.optional(),
  layer: z.string().optional(),
  uuid: z.string().optional(),
  hide: z.boolean().optional(),
  effects: kicadEffects.optional(),
})

type InferredKicadProperty = z.infer<typeof kicadProperty>
expectTypesMatch<KicadProperty, InferredKicadProperty>(true)

export interface KicadFootprintProperties {
  Reference?: KicadProperty
  Value?: KicadProperty
  Datasheet?: KicadProperty
  Description?: KicadProperty
}

export const kicadFootprintProperties = z.object({
  Reference: kicadProperty.optional(),
  Value: kicadProperty.optional(),
  Datasheet: kicadProperty.optional(),
  Description: kicadProperty.optional(),
})

type InferredKicadFootprintProperties = z.infer<typeof kicadFootprintProperties>
expectTypesMatch<KicadFootprintProperties, InferredKicadFootprintProperties>(
  true,
)

export interface KicadFootprintAttributes {
  through_hole?: boolean
  smd?: boolean
  exclude_from_pos_files?: boolean
  exclude_from_bom?: boolean
}

export const kicadFootprintAttributes = z.object({
  through_hole: z.boolean().optional(),
  smd: z.boolean().optional(),
  exclude_from_pos_files: z.boolean().optional(),
  exclude_from_bom: z.boolean().optional(),
})

type InferredKicadFootprintAttributes = z.infer<typeof kicadFootprintAttributes>
expectTypesMatch<KicadFootprintAttributes, InferredKicadFootprintAttributes>(
  true,
)

export interface KicadFootprintPad {
  name: string
  type: string
  shape?: string
  at?: KicadAt
  size?: { x: number; y: number }
  drill?: number
  layers?: string[]
  removeUnusedLayers?: boolean
  uuid?: string
}

export const kicadFootprintPad = z.object({
  name: z.string(),
  type: z.string(),
  shape: z.string().optional(),
  at: kicadAt.optional(),
  size: point.optional(),
  drill: distance.optional(),
  layers: z.array(z.string()).optional(),
  removeUnusedLayers: z.boolean().optional(),
  uuid: z.string().optional(),
})

type InferredKicadFootprintPad = z.infer<typeof kicadFootprintPad>
expectTypesMatch<KicadFootprintPad, InferredKicadFootprintPad>(true)

export interface KicadFootprintModel {
  path: string
  offset?: { x: number; y: number; z: number }
  scale?: { x: number; y: number; z: number }
  rotate?: { x: number; y: number; z: number }
}

export const kicadFootprintModel = z.object({
  path: z.string(),
  offset: point3.optional(),
  scale: point3.optional(),
  rotate: point3.optional(),
})

type InferredKicadFootprintModel = z.infer<typeof kicadFootprintModel>
expectTypesMatch<KicadFootprintModel, InferredKicadFootprintModel>(true)

export interface KicadFootprintMetadata {
  footprintName?: string
  version?: number | string
  generator?: string
  generatorVersion?: number | string
  layer?: string
  properties?: KicadFootprintProperties
  attributes?: KicadFootprintAttributes
  pads?: KicadFootprintPad[]
  embeddedFonts?: boolean
  model?: KicadFootprintModel
}

export const kicadFootprintMetadata = z.object({
  footprintName: z.string().optional(),
  version: z.union([z.number(), z.string()]).optional(),
  generator: z.string().optional(),
  generatorVersion: z.union([z.number(), z.string()]).optional(),
  layer: z.string().optional(),
  properties: kicadFootprintProperties.optional(),
  attributes: kicadFootprintAttributes.optional(),
  pads: z.array(kicadFootprintPad).optional(),
  embeddedFonts: z.boolean().optional(),
  model: kicadFootprintModel.optional(),
})

type InferredKicadFootprintMetadata = z.infer<typeof kicadFootprintMetadata>
expectTypesMatch<KicadFootprintMetadata, InferredKicadFootprintMetadata>(true)
