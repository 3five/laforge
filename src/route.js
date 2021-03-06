import { merge } from 'lodash'
import { upsert } from './helpers'

export default function route(method = 'get', uri, priority = 100) {
  return (target, property, descriptor)=> {
    descriptor.initializer = function() {
      let handler = descriptor.value
      let routes = this.routes = merge([], this.routes)
      let identifier = `${method.toLowerCase()} ${uri}`
      let routeDef = { method, uri, priority, handler, identifier }
      upsert(routes, {identifier}, routeDef)
    }
    return descriptor
  }
}