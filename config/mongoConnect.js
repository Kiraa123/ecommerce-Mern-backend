const mongoose = require('mongoose');
const logger = require('../util/winston');
const databaseUrl = process.env.MONGOOSE_URL;

const connect = mongoose.connect(databaseUrl);

connect.then(() => {
    console.log('db connected');
    logger.info('connection success.');
}).catch(error => {
    console.error('Error connecting to the database:', error);
});

module.exports = connect;
