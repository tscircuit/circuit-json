import type { TypeEqual } from "ts-expect"

type IsNever<T> = [T] extends [never] ? true : false

export const expectTypesMatch = <
  const T1,
  const T2,
  T3 = Exclude<keyof T1, keyof T2>,
  T4 = Exclude<keyof T2, keyof T1>,
>(
  shouldBe: IsNever<T3> extends true
    ? IsNever<T4> extends true
      ? TypeEqual<T1, T2>
      : `extra props ${T4 extends string ? T4 : ""}`
    : `missing props ${T3 extends string ? T3 : ""}`,
): void => {}

// ------ TESTS -------

expectTypesMatch<
  {
    a: number
  },
  {
    a: number
    b: number
  }
>("extra props b")

expectTypesMatch<
  {
    a: number
    b: number
  },
  {
    a: number
  }
>("missing props b")

expectTypesMatch<
  {
    a: number
  },
  {
    a: number
  }
>(true)
