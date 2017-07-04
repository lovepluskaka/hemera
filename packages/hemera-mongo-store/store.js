'use strict'

const Store = require('hemera-store')
const STORE_METHODS = [
  'create',
  'remove',
  'removeById',
  'update',
  'updateById',
  'find',
  'findById',
  'replace',
  'replaceById',
]

/**
 *
 *
 * @class MongoStore
 * @extends {Store}
 */
class MongoStore extends Store {
  /**
   * Creates an instance of MongoStore.
   *
   * @param {any} driver
   * @param {any} options
   *
   * @memberOf MongoStore
   */
  constructor (driver,options = { mongo: {}, store: {} }) {
    super(driver, options)
    if (!this.options.hasOwnProperty('store')) {
      this.options.store = {}
    }
    for (let method of STORE_METHODS) {
      if (!this.options.store.hasOwnProperty(method)) {
        this.options.store[method] = {}
      }
    }
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} cb
   *
   * @memberOf MongoStore
   */
  create (req, cb) {
    if (req.data instanceof Array) {
      this._driver.insertMany(req.data, this.options.store.create, function (err, resp) {
        if (err) {
          return cb(err)
        }
        const result = {
          _ids: resp.insertedIds
        }
        cb(err, result)
      })
    } else if (req.data instanceof Object) {
      this._driver.insertOne(req.data, this.options.store.create, function (err, resp) {
        if (err) {
          return cb(err)
        }
        const result = {
          _id: resp.insertedId.toString()
        }
        cb(err, result)
      })
    }
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} cb
   *
   * @memberOf MongoStore
   */
  remove (req, cb) {
    this._driver.deleteMany(req.query, this.options.store.remove, function (err, resp) {
      if (err) {
        return cb(err)
      }
      const result = {
        deletedCount: resp.deletedCount
      }
      cb(err, result)
    })
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} cb
   *
   * @memberOf MongoStore
   */
  removeById (req, cb) {
    this._driver.findOneAndDelete({
      _id: this.ObjectID(req.id)
    }, this.options.store.removeById, function (err, resp) {
      if (err) {
        return cb(err)
      }
      const result = resp.value
      cb(err, result)
    })
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} data
   * @param {any} cb
   *
   * @memberOf MongoStore
   */
  update (req, data, cb) {
    this._driver.findOneAndUpdate(req.query, data, this.options.store.update, function (err, resp) {
      if (err) {
        return cb(err)
      }
      const result = resp.value
      cb(err, result)
    })
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} data
   * @param {any} cb
   *
   * @memberOf MongoStore
   */
  updateById (req, data, cb) {
    this._driver.findOneAndUpdate({
      _id: this.ObjectID(req.id)
    }, data, this.options.store.updateById, function (err, resp) {
      if (err) {
        return cb(err)
      }
      const result = resp.value
      cb(err, result)
    })
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} cb
   *
   * @memberOf MongoStore
   */
  find (req, options, cb) {
    let cursor = this._driver.find(req.query, this.options.store.find)

    if (options) {
      if (options.limit) {
        cursor = cursor.limit(options.limit)
      }
      if (options.offset) {
        cursor = cursor.skip(options.offset)
      }
      if (options.fields) {
        cursor = cursor.project(options.fields)
      }
      if (options.orderBy) {
        cursor = cursor.sort(options.orderBy)
      }
    }
    cursor.toArray(function (err, resp) {
      if (err) {
        return cb(err)
      }
      const result = Object.assign({
        result: resp
      }, options)
      cb(err, result)
    })
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} cb
   *
   * @memberOf MongoStore
   */
  findById (req, cb) {
    this._driver.findOne({
      _id: this.ObjectID(req.id)
    }, this.options.store.findById, function (err, resp) {
      cb(err, resp)
    })
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} cb
   *
   * @memberOf MongoStore
   */
  replace (req, data, cb) {
    this._driver.updateMany(req.query, data, Object.assign(this.options.store.replace, {
      upsert: true
    }), function (err, resp) {
      if (err) {
        return cb(err)
      }
      const result = {
        matchedCount: resp.matchedCount,
        modifiedCount: resp.modifiedCount,
        upsertedCount: resp.upsertedCount,
        upsertedId: resp.upsertedId
      }
      cb(err, result)
    })
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} cb
   *
   * @memberOf MongoStore
   */
  replaceById (req, data, cb) {
    this._driver.findOneAndReplace({
      _id: this.ObjectID(req.id)
    }, data, this.mongo.options.replaceById, function (err, resp) {
      if (err) {
        return cb(err)
      }
      const result = resp.value
      cb(err, result)
    })
  }
}

module.exports = MongoStore
