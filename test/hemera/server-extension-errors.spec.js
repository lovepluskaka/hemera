'use strict'

describe('Server Extension error', function() {
  var PORT = 6242
  var authUrl = 'nats://localhost:' + PORT
  var server

  // Start up our own nats-server
  before(function(done) {
    server = HemeraTestsuite.start_server(PORT, done)
  })

  // Shutdown our server after we are done
  after(function() {
    server.kill()
  })

  it('Should be able to pass a custom super error to onServerPreRequest', function(
    done
  ) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    let plugin = function(hemera, options, done) {
      hemera.ext('onServerPreRequest', function(ctx, req, res, next) {
        next(new UnauthorizedError('test'))
      })

      hemera.add(
        {
          cmd: 'add',
          topic: 'math'
        },
        (resp, cb) => {
          cb(null, resp.a + resp.b)
        }
      )

      done()
    }

    hemera.use({
      plugin: plugin,
      options: {
        name: 'myPlugin'
      }
    })

    hemera.ready(() => {
      hemera.act(
        {
          topic: 'math',
          cmd: 'add',
          a: 1,
          b: 2
        },
        (err, resp) => {
          expect(err).to.be.exists()
          expect(err.name).to.be.equals('Unauthorized')
          expect(err.message).to.be.equals('test')
          expect(err.hops).to.be.exists()
          expect(err.hops.length).to.be.equals(1)
          expect(err.hops[0].service).to.be.equals('math')
          expect(err.hops[0].method).to.be.equals('a:1,b:2,cmd:add,topic:math')
          hemera.close(done)
        }
      )
    })
  })

  it('Should be able to pass an error to onServerPreRequest', function(done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    let plugin = function(hemera, options, done) {
      hemera.ext('onServerPreRequest', function(ctx, req, res, next) {
        next(new Error('test'))
      })

      hemera.add(
        {
          cmd: 'add',
          topic: 'math'
        },
        (resp, cb) => {
          cb(null, resp.a + resp.b)
        }
      )

      done()
    }

    hemera.use({
      plugin: plugin,
      options: {
        name: 'myPlugin'
      }
    })

    hemera.ready(() => {
      hemera.act(
        {
          topic: 'math',
          cmd: 'add',
          a: 1,
          b: 2
        },
        (err, resp) => {
          expect(err).to.be.exists()
          expect(err.name).to.be.equals('Error')
          expect(err.message).to.be.equals('test')
          expect(err.hops).to.be.exists()
          expect(err.hops.length).to.be.equals(1)
          expect(err.hops[0].service).to.be.equals('math')
          expect(err.hops[0].method).to.be.equals('a:1,b:2,cmd:add,topic:math')
          hemera.close(done)
        }
      )
    })
  })

  it('Should be able to pass a custom super error to onServerPreResponse', function(
    done
  ) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    let plugin = function(hemera, options, done) {
      hemera.ext('onServerPreResponse', function(ctx, req, res, next) {
        next(new UnauthorizedError('test'))
      })

      hemera.add(
        {
          cmd: 'add',
          topic: 'math'
        },
        (resp, cb) => {
          cb(null, resp.a + resp.b)
        }
      )

      done()
    }

    hemera.use({
      plugin: plugin,
      options: {
        name: 'myPlugin'
      }
    })

    hemera.ready(() => {
      hemera.act(
        {
          topic: 'math',
          cmd: 'add',
          a: 1,
          b: 2
        },
        (err, resp) => {
          expect(err).to.be.exists()
          expect(err.name).to.be.equals('Unauthorized')
          expect(err.message).to.be.equals('test')
          expect(err.hops).to.be.exists()
          expect(err.hops.length).to.be.equals(1)
          expect(err.hops[0].service).to.be.equals('math')
          expect(err.hops[0].method).to.be.equals('a:1,b:2,cmd:add,topic:math')
          hemera.close(done)
        }
      )
    })
  })

  it('Should be able to pass an error to onServerPreResponse', function(done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    let plugin = function(hemera, options, done) {
      hemera.ext('onServerPreResponse', function(ctx, req, res, next) {
        next(new Error('test'))
      })

      hemera.add(
        {
          cmd: 'add',
          topic: 'math'
        },
        (resp, cb) => {
          cb(null, resp.a + resp.b)
        }
      )

      done()
    }

    hemera.use({
      plugin: plugin,
      options: {
        name: 'myPlugin'
      }
    })

    hemera.ready(() => {
      hemera.act(
        {
          topic: 'math',
          cmd: 'add',
          a: 1,
          b: 2
        },
        (err, resp) => {
          expect(err).to.be.exists()
          expect(err.name).to.be.equals('Error')
          expect(err.message).to.be.equals('test')
          expect(err.hops).to.be.exists()
          expect(err.hops.length).to.be.equals(1)
          expect(err.hops[0].service).to.be.equals('math')
          expect(err.hops[0].method).to.be.equals('a:1,b:2,cmd:add,topic:math')
          hemera.close(done)
        }
      )
    })
  })
})
