import { merge } from 'lodash'
import { upsert } from './helpers'

export default function middleware(uri = '/', priority = 50) {
  return (target, property, descriptor)=> {
    descriptor.initializer = function() {
      let handler = descriptor.value
      let routes = this.routes = merge([], this.routes)
      let identifier = `middleware ${uri}`
      let routeDef = { uri, priority, handler, middleware: true }
      upsert(routes, {identifier}, routeDef)
    }
    return descriptor
  }
}