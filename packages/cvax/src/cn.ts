import { twMerge } from "tailwind-merge"
import { ClassValue } from "./types"
import { cx } from "./cx"

/* cn
   ============================================ */
export function cn(...inputs: ClassValue[]) {
  return twMerge(cx(inputs))
}
