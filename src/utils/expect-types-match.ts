import type { TypeEqual } from "ts-expect"

type IsNever<T> = [T] extends [never] ? true : false

type GetMismatchedProps<T1, T2> = {
  [K in keyof T1 & keyof T2]: T1[K] extends T2[K]
    ? T2[K] extends T1[K]
      ? never
      : K
    : K
}[keyof T1 & keyof T2]

export const expectTypesMatch = <
  const T1,
  const T2,
  T3 = Exclude<keyof T1, keyof T2>,
  T4 = Exclude<keyof T2, keyof T1>,
  T5 = GetMismatchedProps<T1, T2>,
>(
  shouldBe: IsNever<T3> extends true
    ? IsNever<T4> extends true
      ? IsNever<T5> extends true
        ? TypeEqual<T1, T2>
        : `mismatched prop types: ${T5 extends string ? T5 : ""}`
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

expectTypesMatch<
  {
    a: number
  },
  {
    a: string
  }
>("mismatched prop types: a")
