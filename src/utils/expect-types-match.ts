import type { TypeEqual } from "ts-expect"

export const expectTypesMatch = <const T1, const T2>(
  shouldBe: TypeEqual<T1, T2>,
): void => {}
