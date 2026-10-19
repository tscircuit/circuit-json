import type { PcbBoard } from "./pcb_board"
import type { LayerRef } from "./properties/layer_ref"
import { validatePcbBoardStackup } from "./validate-pcb-board-stackup"

/**
 * Resolve electrical conductivity in S/m for a parsed board's copper layer.
 * Pass each pcb_trace wire route point's layer; one trace may span several layers.
 * A layer value overrides its referenced material. Missing data stays undefined.
 * Does not modify Circuit JSON or infer via plating conductivity from adjacent layers.
 */
export function getPcbLayerConductivity(
  board: PcbBoard,
  layer: LayerRef,
): number | undefined {
  validatePcbBoardStackup(board)
  const stackup = board.stackup
  const copper = stackup?.layers.find(
    (entry) => entry.type === "copper" && entry.layer === layer,
  )
  if (copper?.type !== "copper") return undefined
  return (
    copper.conductivity_s_per_m ??
    (copper.material_id === undefined
      ? undefined
      : stackup?.materials?.[copper.material_id]?.conductivity_s_per_m)
  )
}
