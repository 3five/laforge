import {Router, route} from '../lib'
import Express from 'express'

class Test extends Router {

  @route('get', '/foo')
  foo(opts, http) {
    return Promise.resolve('foo')
  }

  @route('get', '/bar')
  bar(opts, http) {
    return Promise.resolve('bar')
  }

}

class Baz extends Test {

  @route('get', '/baz')
  baz(opts, http) {
    return Promise.resolve('baz')
  }

  @route('get', '/bar')
  bar(opts, http) {
    return Promise.resolve('overrride!!')
  }

}


class Bar extends Baz {
  @route('get', '/bar')
  child(opts, http) {
    return Promise.resolve('CHild!')
  }
}


const app = Express()
export default app

const baz = new Baz()
const bar = new Bar()

app.use(baz.handler())

app.use('/child', bar.handler())

app.get('/', (req, res)=> {
  res.sendStatus(200)
})
