export const MODEL_3D_FORMATS = [
  "obj",
  "stl",
  "3mf",
  "gltf",
  "glb",
  "step",
  "wrl",
] as const

export type CadModel3dFormat = (typeof MODEL_3D_FORMATS)[number]
export type AxisDirection3d = "x+" | "x-" | "y+" | "y-" | "z+" | "z-"

export const DEFAULT_BOARD_NORMAL_DIRECTION: AxisDirection3d = "z+"

export const CAD_MODEL_CONVENTIONS: Record<
  CadModel3dFormat,
  {
    boardNormalDirection: AxisDirection3d
    isFormatDefined: boolean
  }
> = {
  obj: {
    boardNormalDirection: DEFAULT_BOARD_NORMAL_DIRECTION,
    isFormatDefined: false,
  },
  stl: {
    boardNormalDirection: DEFAULT_BOARD_NORMAL_DIRECTION,
    isFormatDefined: false,
  },
  "3mf": { boardNormalDirection: "z+", isFormatDefined: true },
  gltf: { boardNormalDirection: "y+", isFormatDefined: true },
  glb: { boardNormalDirection: "y+", isFormatDefined: true },
  step: {
    boardNormalDirection: DEFAULT_BOARD_NORMAL_DIRECTION,
    isFormatDefined: false,
  },
  wrl: { boardNormalDirection: "y+", isFormatDefined: true },
} as const
