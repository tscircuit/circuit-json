import type { PcbBoard } from "./pcb_board"

/**
 * Check a parsed board's copper layer count against num_layers before consuming its stackup.
 * pcb_board.parse validates the nested stackup but retains its existing num_layers default.
 * Producers should specify num_layers: an omitted count defaults to four even for a six-layer stackup.
 * Throws on disagreement; boards without a stackup require no additional check.
 * Nominal layer thicknesses are not equated with board thickness (finishes/pressing/tolerances differ).
 */
export function validatePcbBoardStackup(board: PcbBoard): void {
  if (!board.stackup) return

  const copper_count = board.stackup.layers.filter(
    (layer) => layer.type === "copper",
  ).length
  if (copper_count !== board.num_layers) {
    throw new Error(
      `Board ${board.pcb_board_id}: num_layers is ${board.num_layers}, but stackup contains ${copper_count} copper layers`,
    )
  }
}
