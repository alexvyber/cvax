import { ClassValue } from "./types"

export type CxOptions = Parameters<typeof cx>
export type CxReturn = ReturnType<typeof cx>

/* cx
   ============================================ */
export function cx(...inputs: ClassValue[]): string
export function cx() {
  let i = 0,
    str = "",
    tmp: any,
    { length } = arguments

  while (i < length) {
    if ((tmp = arguments[i++])) {
      str += getStr(tmp)
    }
  }

  return str.trim()
}

function getStr(classes: ClassValue) {
  if (!classes || typeof classes === "boolean") return ""
  if (typeof classes === "number") return classes + " "

  if (typeof classes === "object") {
    let str = ""

    if (Array.isArray(classes)) {
      if (classes.length === 0) return ""

      for (const item of classes.flat(Infinity as 0)) {
        if (item) {
          str += getStr(item)
        }
      }
    } else {
      for (const key in classes) {
        if (key === "class" || key === "className") {
          str += getStr(classes[key]) + " "
        } else if (classes[key]) {
          str += key + " "
        }
      }
    }

    return str
  }

  return classes + " "
}
