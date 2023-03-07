type OptionalPropertyNames<T> = {
  [Key in keyof T]-?: {} extends { [P in Key]: T[Key] } ? Key : never
}[keyof T]

type SpreadProperties<Left, Right, Key extends keyof Left & keyof Right> = {
  [P in Key]: Left[P] | Exclude<Right[P], undefined>
}

type Identity<T> = T extends infer U ? { [Key in keyof U]: U[Key] } : never

type SpreadTwo<Left, Right> = Identity<
  Pick<Left, Exclude<keyof Left, keyof Right>> &
    Pick<Right, Exclude<keyof Right, OptionalPropertyNames<Right>>> &
    Pick<Right, Exclude<OptionalPropertyNames<Right>, keyof Left>> &
    SpreadProperties<Left, Right, OptionalPropertyNames<Right> & keyof Left>
>

type Spread<Args extends readonly [...any]> = Args extends [infer Left, ...infer Right]
  ? SpreadTwo<Left, Spread<Right>>
  : unknown

export function merge<Args extends object[]>(...args: [...Args]) {
  return Object.assign({}, ...args) as Spread<Args>
}
