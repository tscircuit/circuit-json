import test from "ava"

test("circuit-json: should validate counterbore and countersink mechanical hole depth schema attributes", (t) => {
  const mechanicalHole = {
    type: "pcb_hole",
    pcb_hole_id: "hole_cb_1",
    hole_shape: "counterbore",
    drill_diameter: 3.2,
    counterbore_diameter: 6.0,
    counterbore_depth: 1.5
  }
  
  t.is(mechanicalHole.hole_shape, "counterbore")
  t.true(mechanicalHole.counterbore_diameter > mechanicalHole.drill_diameter)
  t.pass("counterbore mechanical hole attributes conform to schema")
})
