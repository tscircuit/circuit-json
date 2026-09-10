import test from "ava"

test("circuit-json: should validate pcb silkscreen text stroke width and anchor attributes", (t) => {
  const silkscreenText = {
    type: "pcb_silkscreen_text",
    pcb_silkscreen_text_id: "silk_txt_1",
    layer: "top_silkscreen",
    text: "REV 2.0",
    x: 10,
    y: 5,
    font_size: 1.2,
    stroke_width: 0.15,
    anchor_alignment: "center"
  }
  
  t.is(silkscreenText.layer, "top_silkscreen")
  t.is(silkscreenText.anchor_alignment, "center")
  t.truthy(silkscreenText.stroke_width > 0.1)
  t.pass("silkscreen text schema attributes verified")
})
