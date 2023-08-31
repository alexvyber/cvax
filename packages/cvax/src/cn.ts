import { twMerge } from "tailwind-merge"
import { ClassValue } from "./"
import { cx } from "./"

/* cn
   ============================================ */
/**
 * @deprecated deprecated
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(cx(inputs))
}
