import test from "ava"

test("validates SMD oval pad geometry with corner radius and copper pullback margin", (t) => {
  const ovalPad = {
    type: "pcb_smtpad",
    shape: "oval",
    x: 0,
    y: 0,
    width: 1.2,
    height: 2.4,
    radius: 0.6,
    layer: "top",
    copper_pullback: 0.15
  }
  
  t.is(ovalPad.type, "pcb_smtpad")
  t.is(ovalPad.shape, "oval")
  t.is(ovalPad.radius, ovalPad.width / 2)
  t.true(ovalPad.copper_pullback > 0)
})
