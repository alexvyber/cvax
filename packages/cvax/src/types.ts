export type ClassPropKey = "className"
export type ClassValue = string | null | undefined | readonly ClassValue[]
export type ClassProp = { className: ClassValue } | { className?: never }
export type OmitUndefined<T> = T extends undefined ? never : T
export type StringToBoolean<T> = T extends "true" | "false" ? boolean : T
