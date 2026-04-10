export type DeepImmutable<T> = T extends primitive
  ? T
  : T extends Array<infer U>
    ? ReadonlyArray<DeepImmutable<U>>
    : T extends Map<infer K, infer V>
      ? ReadonlyMap<DeepImmutable<K>, DeepImmutable<V>>
      : T extends Set<infer U>
        ? ReadonlySet<DeepImmutable<U>>
        : { readonly [K in keyof T]: DeepImmutable<T[K]> }

type primitive = string | number | boolean | undefined | null | bigint | symbol

export type Permutations<T extends string, U extends string = T> = T extends unknown
  ? T | `${T} ${Permutations<Exclude<U, T>>}`
  : never
