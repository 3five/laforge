import Url from 'url'
import { Router as ExpressRouter } from 'express'
import { sortBy, map, template, merge } from 'lodash'

export default class Router {

  constructor() {
    this.router = ExpressRouter()
  }

  registerRoutes() {
    let routes = this.buildRoutes()
    for (let route of routes) {
      let method = route.method.toLowerCase()
      this.router[method](route.uri, this.genericHandler(route))
    }
  }

  buildRoutes() {
    let routes = sortBy(this.routes, 'priority')
    return map(routes, (route)=> {
      route.uri = template(route.uri)(this)
      return route
    })
  }

  handler() {
    this.registerRoutes()
    return this.router
  }

  genericHandler(route) {
    return (req, res)=> {
      const opts = this.options(req)
      const http = { req, res }
      const handler = route.handler.call(this, opts, http)
      Promise.resolve(handler)
        .then(result => res.json(this.okay(result)))
        .catch(err => {
          res.status(500)
          res.json(this.error(err))
        })
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
      body: req.body,
      headers: req.headers
    }
  }
}
