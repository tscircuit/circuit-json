import type { LayerRef } from "../pcb/properties/layer_ref"

/**
 * Inclusive physical copper span of a via, independent of a trace's logical
 * layer transition. Layers describe depth along the board Z axis; there are
 * no XY coordinates or units in this value.
 */
export interface PcbViaSpan {
  from_layer: LayerRef
  to_layer: LayerRef
}

const getCopperLayerStack = (layerCount: number): LayerRef[] => {
  // LayerRef currently supports up to eight inner layers.
  if (!Number.isInteger(layerCount) || layerCount < 2 || layerCount > 10) {
    throw new Error("Via spans require an integer layer count between 2 and 10")
  }
  return [
    "top",
    ...Array.from(
      { length: layerCount - 2 },
      (_, index) => `inner${index + 1}` as LayerRef,
    ),
    "bottom",
  ]
}

/**
 * Converts legacy physical pcb_via.layers to a span in top-to-bottom order.
 * Pass physical layers, never a trace's from_layer/to_layer transition. The
 * caller must resolve through/blind/buried policy before calling this helper.
 * Sparse legacy arrays describe the inclusive span between their extremes.
 * Unknown board layers and fewer than two distinct layers are rejected.
 */
export const getPcbViaSpanFromLayers = (
  layers: readonly LayerRef[],
  layerCount: number,
): PcbViaSpan => {
  const stack = getCopperLayerStack(layerCount)
  const indices = layers.map((layer) => {
    const index = stack.indexOf(layer)
    if (index === -1) {
      throw new Error(
        `Via layer "${layer}" is not on the ${layerCount}-layer board`,
      )
    }
    return index
  })
  if (new Set(indices).size < 2) {
    throw new Error("A via span requires at least two distinct copper layers")
  }
  return {
    from_layer: stack[Math.min(...indices)]!,
    to_layer: stack[Math.max(...indices)]!,
  }
}

/**
 * Expands a physical span for layer-specific geometry and spatial indexes.
 * Always returns top-to-bottom order, including every intermediate copper
 * layer. Board context is required: top-to-bottom may cross 2, 4, 6, etc. layers.
 * This helper does not infer manufacturing policy from logical route endpoints.
 */
export const getPcbViaSpanLayers = (
  span: PcbViaSpan,
  layerCount: number,
): LayerRef[] => {
  const normalizedSpan = getPcbViaSpanFromLayers(
    [span.from_layer, span.to_layer],
    layerCount,
  )
  const stack = getCopperLayerStack(layerCount)
  return stack.slice(
    stack.indexOf(normalizedSpan.from_layer),
    stack.indexOf(normalizedSpan.to_layer) + 1,
  )
}
