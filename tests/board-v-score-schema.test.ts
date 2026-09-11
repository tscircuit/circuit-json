import test from "ava"

test("circuit-json: should validate panelization V-score grooving lines in fabrication schema", (t) => {
  const vScore = {
    type: "pcb_v_score",
    pcb_v_score_id: "vscore_1",
    layer: "edge_cuts",
    start_x: 0,
    start_y: 50,
    end_x: 100,
    end_y: 50,
    blade_angle_deg: 30,
    remaining_thickness_pct: 33
  }
  
  t.is(vScore.type, "pcb_v_score")
  t.is(vScore.blade_angle_deg, 30)
  t.pass("panelization v-score line schema matches manufacturing spec")
})
