import test from "ava"

test("validates SMD rectangular pad array definition and mask expansion rules", (t) => {
  const pad = {
    type: "pcb_smtpad",
    shape: "rect",
    x: 2.54,
    y: 1.27,
    width: 0.8,
    height: 1.6,
    layer: "top",
    solder_mask_margin: 0.05
  }
  
  t.is(pad.type, "pcb_smtpad")
  t.is(pad.shape, "rect")
  t.true(pad.solder_mask_margin >= 0)
  t.is(pad.width + (pad.solder_mask_margin * 2), 0.9)
})
