import { find, indexOf } from 'lodash'

export function upsert(arr, key, newval) {
  var match = find(arr, key)
  if (match) {
    let index = indexOf(arr, match)
    arr.splice(index, 1, newval)
  } else {
    arr.push(newval)
  }
}