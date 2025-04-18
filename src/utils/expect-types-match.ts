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

// ------ String Union Matching -------

export type ExpectStringUnionsMatch<
  T1 extends string,
  T2 extends string,
  Diff1 = Exclude<T1, T2>,
  Diff2 = Exclude<T2, T1>,
> = IsNever<Diff1> extends true
  ? IsNever<Diff2> extends true
    ? true // Unions are identical
    : `T2 has extra: "${Diff2 extends string ? Diff2 : ""}"` // T2 has elements not in T1
  : IsNever<Diff2> extends true
    ? `T1 has extra: "${Diff1 extends string ? Diff1 : ""}"` // T1 has elements not in T2
    : `T1 has extra: "${Diff1 extends string
        ? Diff1
        : ""}", T2 has extra: "${Diff2 extends string ? Diff2 : ""}"` // Both have differences

export const expectStringUnionsMatch = <
  const T1 extends string,
  const T2 extends string,
  ShouldBeTrue = ExpectStringUnionsMatch<T1, T2>,
>(
  shouldBe: ShouldBeTrue,
): void => {}

// ------ TESTS -------

type TestUnion1 = "a" | "b" | "c"
type TestUnion2 = "a" | "b" | "c"
type TestUnion3 = "a" | "b" | "d"
type TestUnion4 = "a" | "b"

expectStringUnionsMatch<TestUnion1, TestUnion2>(true)
expectStringUnionsMatch<TestUnion1, TestUnion3>(
  'T1 has extra: "c", T2 has extra: "d"',
)
expectStringUnionsMatch<TestUnion1, TestUnion4>('T1 has extra: "c"')
expectStringUnionsMatch<TestUnion4, TestUnion1>('T2 has extra: "c"')
expectStringUnionsMatch<TestUnion3, TestUnion1>(
  'T1 has extra: "d", T2 has extra: "c"',
)

// Example of using @ts-expect-error for expected failures
// @ts-expect-error Type '"T2 has extra: \"d\""' is not assignable to type 'true'.
expectStringUnionsMatch<TestUnion1, TestUnion3>(true)
