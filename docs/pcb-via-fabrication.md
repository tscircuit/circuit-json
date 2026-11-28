# Via fabrication fields

All fabrication fields on `pcb_via` are optional. Parsed distances are in
millimeters. The `plus` and `minus` allowances are nonnegative magnitudes above
and below the nominal finished `hole_diameter`.

| Circuit JSON field                                  | IPC-2581C                                                                                                                                    | ODB++                                                                                                                                                                                                                                                                                                       |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ipc_4761_via_type_top`, `ipc_4761_via_type_bottom` | Treatment layers such as `COATINGNONCOND`, `HOLEFILL`, and `COATINGCOND`. Capped holes can use `PadstackHoleDef.platingStatus = VIA_CAPPED`. | Via drill feature attributes `.ipc_via_type_top` and `.ipc_via_type_bottom`.                                                                                                                                                                                                                                |
| `drill_method`                                      | `Spec/Tool` with `type="LASER"` for laser drilling. Mechanical tools can be specified by tool type, such as `CARBIDE`.                       | Via feature `.via_type` of `Drilled` or `Laser` and tool `TYPE2` of `STANDARD` or `LASER`, respectively.                                                                                                                                                                                                    |
| `hole_diameter_tolerance`                           | `PadstackHoleDef.plusTol` and `minusTol` relative to `diameter`.                                                                             | Drill tool `MAX_TOL` and `MIN_TOL` apply to the finished hole. `FINISH_SIZE` is the finished diameter. `DRILL_SIZE` is the tool diameter.                                                                                                                                                                   |
| `backdrill`                                         | `Spec/Backdrill` properties `START_LAYER`, `MUST_NOT_CUT_LAYER`, and `MAX_STUB_LENGTH`. The backdrill diameter belongs to its drill feature. | A drill layer with `ADD_TYPE=BACKDRILL`, `START_NAME` for the entry surface, and `.backdrill_penetrate_stop_layer` for the protected layer. The drill feature carries `.backdrill_max_stub_drill` and uses its own drill tool. A maximum drill depth (`.backdrill_max_depth`) requires stackup information. |

ODB++ encodes the IPC-4761 types as `1` (`tented`), `2` (`tented_and_covered`),
`3` (`plugged`), `4` (`plugged_and_covered`), `5` (`filled`),
`6` (`filled_and_covered`), and `7` (`filled_and_capped`). For types I–IV
and VI, specifying the type on one side represents the single-sided variant
and specifying it on both sides represents the double-sided variant. Filling
applies to the hole barrel. See [IPC-4761](https://www.ipc.org/TOC/IPC-4761.pdf)
and the [ODB++Design specification, p. 267](https://odbplusplus.com/wp-content/uploads/sites/2/2024/08/odb_spec_user.pdf#page=267).

If a side has an IPC-4761 protection type, its `tented_on_top` or
`tented_on_bottom` flag must be true or omitted. Legacy `is_tented: false`
supplies the fallback only on sides without an explicit protection type.

References: [IPC-2581C schema and validation](https://www.ipc2581.com/ipc-2581-file-validation-tool/)
and [Siemens backdrill attribute definitions](https://odbplusplus.com/wp-content/uploads/sites/2/2020/05/brd2odb_user-6.pdf).
