/*
* CRUD logic for MongoDB with light validations on the params.
* Based on schema object passed by constructor.
* This class is created to prevent a little change to validations have to be made in multiple MongoDb service files in all Node.js projects of Swalbe/lej333.
* And does checks before connect to MongoDb to be sure the connection will be made safely.
* All functions except the initializeConnection function always returns record(s).
*/

const Mongoose = require('mongoose');
const Boom = require('@hapi/boom');
const _ = require('lodash');
const Util = require('./util');
const Messages = require('./messages');

class MongoDb {

  constructor(schema, mongoConnection, mongoOptions) {
    if (!schema) {
      throw Boom.badData(Messages.missingSchema);
    }
    if (!mongoConnection || !mongoOptions) {
      throw Boom.badData(Messages.missingMongoConfig);
    }

    this.schema = schema;
    this.mongoConnection = mongoConnection;
    this.mongoOptions = mongoOptions;
  }

  async add(record, select) {
    if (!record) {
      throw Boom.badData(Messages.missingRecord);
    }
    await _initializeConnection(this.mongoConnection, this.mongoOptions);

    let newRecord = new this.schema(record);
    newRecord = await newRecord.save();
    return await this.getById(newRecord.id, select, this.schema);
  }

  async search(search, sort, select) {
    await _initializeConnection(this.mongoConnection, this.mongoOptions);

    let sortObject = null;
    if (!_.isEmpty(sort)) {
      sortObject = {
        sort: sort
      };
    }
    return await this.schema.find(search, null, sortObject).select(select).exec();
  }

  async getById(recordId, select) {
    Util.validateId(recordId);
    await _initializeConnection(this.mongoConnection, this.mongoOptions);
    return await this.schema.findById(recordId).select(select).exec();
  }

  async updateById(recordId, update, select) {
    if (!update) {
      throw Boom.badData(Messages.missingRecord);
    }
    Util.validateId(recordId);
    await _initializeConnection(this.mongoConnection, this.mongoOptions);
    await this.schema.findByIdAndUpdate(recordId, update).exec();
    return await this.getById(recordId, select, this.schema);
  }

  async deleteById(recordId, select) {
    Util.validateId(recordId);
    await _initializeConnection(this.mongoConnection, this.mongoOptions);
    return await this.schema.findByIdAndDelete(recordId).select(select).exec();
  }
}

const _initializeConnection = async(mongoConnection, mongoOptions) => {
  const db = Mongoose.connection;
  db.on('error', (err) => {
    return Promise.reject(Boom.boomify(err));
  });

  if (db._hasOpened) {
    return true;
  }

  Mongoose.Promise = Promise;
  try {
    await Mongoose.connect(mongoConnection, mongoOptions);
  } catch(err) {
    return Promise.reject(Boom.boomify(err));
  }

  return true;
}

module.exports = MongoDb;