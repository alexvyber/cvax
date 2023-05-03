export type ClassPropKey = "class" | "className"
export type ClassValue = string | null | undefined | ClassValue[]
export type ClassProp = { className?: ClassValue | undefined }
export type OmitUndefined<T> = T extends undefined ? never : T
export type StringToBoolean<T> = T extends "true" | "false" ? boolean : T
export type CxOptions = ClassValue[]
export type CxReturn = string
