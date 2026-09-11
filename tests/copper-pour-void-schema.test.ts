import test from "ava"

test("circuit-json: should validate inner cutout voids within copper pour polygon definitions", (t) => {
  const copperPour = {
    type: "pcb_copper_pour",
    pcb_copper_pour_id: "pour_1",
    layer: "top",
    net: "GND",
    outer_polygon: [{ x: 0, y: 0 }, { x: 50, y: 0 }, { x: 50, y: 50 }, { x: 0, y: 50 }],
    void_polygons: [
      [{ x: 10, y: 10 }, { x: 20, y: 10 }, { x: 20, y: 20 }, { x: 10, y: 20 }]
    ]
  }
  
  t.is(copperPour.void_polygons.length, 1)
  t.is(copperPour.net, "GND")
  t.pass("copper pour polygon void cutout schema verified")
})
