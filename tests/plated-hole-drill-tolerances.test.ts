import test from "ava"

test("validates plated through-hole specification with drill tolerance parameters", (t) => {
  const pthHole = {
    type: "pcb_plated_hole",
    x: 5.08,
    y: 2.54,
    hole_diameter: 0.8,
    outer_diameter: 1.4,
    hole_tolerance: 0.05,
    layers: ["top", "bottom"]
  }
  
  t.is(pthHole.type, "pcb_plated_hole")
  t.true(pthHole.outer_diameter > pthHole.hole_diameter)
  const annularRing = (pthHole.outer_diameter - pthHole.hole_diameter) / 2
  t.is(annularRing, 0.3)
})
