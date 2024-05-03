const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { taskDAO } = require('../data-access-layer/task.dao');
const { categoryDAO } = require('../data-access-layer/category.dao');

const connect = async () => {
    try {
        mongod = await MongoMemoryServer.create();
        dbUrl = mongod.getUri();
        
        const conn = await mongoose.connect(dbUrl);

        console.log(`MongoDB connected: ${conn.connection.host}`);

        taskDAO.createSchema()
        console.log(`task schema created`);

        categoryDAO.createSchema()
        console.log(`category schema created`);

    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

const disconnect = async () => {
    try {
        await mongoose.connection.close();
        if (mongod) {
            await mongod.stop();
            mongoose.mongo = null;
        }
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = { connect, disconnect };