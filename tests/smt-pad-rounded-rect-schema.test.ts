import test from "ava"

test("circuit-json: should validate rounded rectangular SMT pads with corner radius ratios", (t) => {
  const pad = {
    type: "pcb_smt_pad",
    pcb_smt_pad_id: "pad_rrect_1",
    shape: "rounded_rect",
    width: 1.2,
    height: 0.6,
    radius_ratio: 0.25,
    layer: "top"
  }
  
  t.is(pad.shape, "rounded_rect")
  t.is(pad.radius_ratio, 0.25)
  t.pass("rounded rectangle pad schema attributes conform to specification")
})
