import Url from 'url'
import { Router as ExpressRouter } from 'express'
import { sortBy, map, template } from 'lodash'

export class Router {
  constructor() {
    this.router = ExpressRouter()
  }

  registerRoutes() {
    let routes = this.buildRoutes()
    for (let route of routes) {
      this.router[route.method.toLowerCase()](route.uri, this.genericHandler(route))
    }
  }

  buildRoutes() {
    let routes = sortBy(this.constructor.routes, 'priority')
    return map(routes, (route)=> {
      route.uri = template(route.uri)(this)
      return route
    })
  }

  handler() {
    return this.router
  }

  genericHandler(route) {
    return (req, res)=> {
      const opts = this.options(req)
      const handler = route.handler.bind(this)(opts, { req, res })
      Promise.resolve(handler)
        .then(result => res.json(this.okay(result)))
        .catch(err => {
          res.status(500)
          res.json(this.error(err))
        })
    }
  }

  genericMiddleware(route) {
    return (req, res, next)=> {
      const opts = this.options(req)
      const handler = route.handler.bind(this)(opts, { req, res })
      Promise.resolve(handler)
        .then(x => next())
        .catch(err => next(err))
    }
  }

  okay(obj) {
    return obj
  }

  error(obj) {
    var ret = { error: true }
    if (process.env.NODE_ENV !== 'production') {
      ret.message = obj.message
      ret.stack = obj.stack
    }
    return ret
  }

  options(req) {

    return {
      params: req.params,
      query: req.query,
      data: req.body,
      headers: req.headers
    }
  }
}

export function route(method = 'get', uri, priority = 100) {
  return (target, property, descriptor)=> {
    let routes = target.constructor.routes || (target.constructor.routes = [])
    let handler = descriptor.value
    routes.push({ method, uri, priority, handler })
    return descriptor
  }
}

export default Router