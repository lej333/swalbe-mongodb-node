# swalbe-mongodb-node

This is a class library with basic CRUD functions for MongoDB with Mongoose. This is used to centralize basic validations to parameters and initialize a safe connection to MongoDB server. All functions will always return an object from a MongoDB collection. Even when you delete a record. This class library is intented for all Node.js projects created by Swalbe/lej333. 

- Validates passed record id with Mongoose.Types.ObjectId.isValid function.
- Validates passed record when adding or updating a record.
- Initializes a safe connection to MongoDB by checking if there is not a connection already opened. Mongoose will throw an error when an existing connection was still opened by concurrencing CRUD function.

### Note
There are Mocha tests available. There is a schema for an users collection available so it will create test collection for you. You need to create a vault with schluessel package and put an object with mongoServer property into it. Or change tests by you self.
