# swalbe-mongodb-node

This is a ES6 class library with basic CRUD functions for MongoDB with Mongoose. This library is created to centralize basic validations to parameters and initialize a safe connection to MongoDB server. All functions will always return an object from a MongoDB collection. Even when you delete a record. This class library is intented for all Node.js projects created by Swalbe/lej333 to reduce double and messed codes.

- Validates passed record id with Mongoose.Types.ObjectId.isValid function.
- Validates passed record when adding or updating a record.
- Initializes a safe connection to MongoDB by checking if there is not a connection already opened. Mongoose will throw an error when an existing connection was still opened by concurrencing CRUD function.

### Usage
```const Vault = require('schluessel');
const Config = require('../config');
const MongoDb = require('swalbe-mongodb');

const db = (schema) => {
  return new MongoDb(schema, Vault.mongoServer, Config.mongoDb.options);
}

module.exports = {
  db
};
```

### Tests
There are Mocha tests available which will run tests based on an users collection. There is a schema in the helpers folder available (users.model.js). You need to create a vault with schluessel package and put an object with mongoServer property into it. Or change tests by you self.
