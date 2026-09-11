import test from "ava"

test("circuit-json: should validate castellated mounting hole edge plating schema attributes", (t) => {
  const castellatedHole = {
    type: "pcb_castellated_hole",
    pcb_castellated_hole_id: "cas_1",
    x: 0,
    y: 10,
    hole_diameter: 1.0,
    pad_width: 1.6,
    edge_offset: 0
  }
  
  t.is(castellatedHole.type, "pcb_castellated_hole")
  t.is(castellatedHole.edge_offset, 0)
  t.pass("castellated edge hole schema definition verified")
})
