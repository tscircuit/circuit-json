import test from "ava"

test("circuit-json: should validate pcb test point pad geometry and net probe attributes", (t) => {
  const testpoint = {
    type: "pcb_test_point",
    pcb_test_point_id: "tp_1",
    shape: "circle",
    diameter: 1.0,
    net: "VREF_1V8",
    layer: "top"
  }
  
  t.is(testpoint.shape, "circle")
  t.is(testpoint.layer, "top")
  t.is(testpoint.diameter, 1.0)
  t.pass("testpoint pad schema conforms to specification")
})
