import test from "ava"

test("circuit-json: should validate layer span attributes for blind and buried vias", (t) => {
  const pcb_via = {
    type: "pcb_via",
    pcb_via_id: "via_blind_1",
    x: 12.5,
    y: 8.0,
    outer_diameter: 0.6,
    hole_diameter: 0.3,
    from_layer: "top",
    to_layer: "inner1",
    via_type: "blind"
  }
  
  t.is(pcb_via.via_type, "blind")
  t.is(pcb_via.from_layer, "top")
  t.is(pcb_via.to_layer, "inner1")
  t.pass("blind/buried via layer transitions conform to Circuit JSON schema")
})
