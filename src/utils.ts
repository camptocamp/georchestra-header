import type { Link } from '@/config-interfaces'

export function allNodes(obj: any, key: string, array?: Link[]): Link[] {
  array = array || []
  if ('object' === typeof obj) {
    for (const k in obj) {
      if (k === key) {
        array.push(obj)
      } else {
        allNodes(obj[k], key, array)
      }
    }
  }
  return array
}
